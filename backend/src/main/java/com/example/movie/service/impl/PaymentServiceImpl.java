package com.example.movie.service.impl;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.dto.payment.PaymentUpdateRequest;
import com.example.movie.exception.AuthenticationRequiredException;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.PaymentMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentResponse confirmPayment(PaymentConfirmRequest request) {
        System.out.println("PaymentServiceImpl.confirmPayment called with bookingId: " + request.getBookingId());
        
        // Find booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new InvalidId(request.getBookingId()));
        
        System.out.println("Found booking: " + booking.getId() + ", status: " + booking.getBookingStatus());

        // Validate booking status
        if (booking.getBookingStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING status");
        }

        // Check if seats are still available (race condition check)
        List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());
        System.out.println("Found " + tickets.size() + " tickets for booking " + booking.getId());
        
        for (Ticket ticket : tickets) {
            System.out.println("Ticket " + ticket.getId() + " status: " + ticket.getStatus());
            if (ticket.getStatus() != Ticket.Status.BOOKED) {
                throw new RuntimeException("Some seats are no longer available");
            }
        }

        // Create payment record (still PENDING until actual payment is processed)
        Payment payment = new Payment();
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setAmount(booking.getTotalPrice());
        payment.setStatus(Payment.PaymentStatus.PENDING); // ✅ Keep PENDING until payment is actually processed
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNote(request.getNote());
        payment.setBooking(booking);

        // DON'T update booking status yet - keep it PENDING until payment is confirmed
        // booking.setBookingStatus(Booking.BookingStatus.PAID);
        // bookingRepository.save(booking);

        // DON'T issue tickets yet - keep them BOOKED until payment is confirmed
        // for (Ticket ticket : tickets) {
        //     ticket.setStatus(Ticket.Status.ISSUED);
        //     ticket.setTicketCode(generateTicketCode());
        //     ticketRepository.save(ticket);
        // }

        Payment savedPayment = paymentRepository.save(payment);

        return paymentMapper.toResponse(savedPayment);
    }

    private String generateTicketCode() {
        // Generate unique ticket code (10-14 characters)
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < 12; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return code.toString();
    }

    @Override
    @Transactional
    public PaymentResponse completePayment(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new InvalidId(paymentId));

        Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status);
        payment.setStatus(paymentStatus);

        if (paymentStatus == Payment.PaymentStatus.SUCCESS) {
            // Update booking status to PAID
            Booking booking = payment.getBooking();
            booking.setBookingStatus(Booking.BookingStatus.PAID);
            bookingRepository.save(booking);
            
            // Update tickets to ISSUED status and generate ticket codes
            List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());
            for (Ticket ticket : tickets) {
                ticket.setStatus(Ticket.Status.ISSUED);
                ticket.setTicketCode(generateTicketCode());
                ticketRepository.save(ticket);
            }
        } else if (paymentStatus == Payment.PaymentStatus.FAILED || paymentStatus == Payment.PaymentStatus.CANCELLED) {
            // Update booking status to CANCELLED
            Booking booking = payment.getBooking();
            booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            
            // Update tickets back to AVAILABLE
            List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());
            for (Ticket ticket : tickets) {
                ticket.setStatus(Ticket.Status.AVAILABLE);
                ticket.setBooking(null); // Remove booking reference
                ticket.setTicketCode(null); // Remove ticket code
                // Restore movie and auditorium from screening
                ticket.setMovie(booking.getScreening().getMovie());
                ticket.setAuditorium(booking.getScreening().getAuditorium());
                ticketRepository.save(ticket);
            }
        }

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse updatePendingPayment(Long paymentId, PaymentUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationRequiredException("User not authenticated");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new InvalidId(paymentId));

        Booking booking = payment.getBooking();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        if (!isAdmin && !booking.getUser().getUsername().equals(authentication.getName())) {
            throw new AccessDeniedException("You do not have permission to update this payment");
        }

        if (payment.getStatus() != Payment.PaymentStatus.PENDING ||
                booking.getBookingStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only pending payments can be updated");
        }

        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNote(request.getNote());

        Payment updatedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(updatedPayment);
    }

    @Override
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new InvalidId(bookingId));
        return paymentMapper.toResponse(payment);
    }

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(paymentMapper::toResponse);
    }
}
