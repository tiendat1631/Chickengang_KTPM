package com.example.movie.service.impl;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.PaymentMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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
        // Find booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new InvalidId(request.getBookingId()));

        // Validate booking status
        if (booking.getBookingStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING status");
        }

        // Check if seats are still available (race condition check)
        List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());
        for (Ticket ticket : tickets) {
            if (ticket.getStatus() != Ticket.Status.AVAILABLE) {
                throw new RuntimeException("Some seats are no longer available");
            }
        }

        // Create payment
        Payment payment = new Payment();
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setAmount(booking.getTotalPrice());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNote(request.getNote());
        payment.setBooking(booking);

        // Update booking status to CONFIRMED
        booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // Update tickets status to SOLD
        for (Ticket ticket : tickets) {
            ticket.setStatus(Ticket.Status.SOLD);
            ticketRepository.save(ticket);
        }

        Payment savedPayment = paymentRepository.save(payment);

        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse completePayment(Long paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new InvalidId(paymentId));

        Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status);
        payment.setStatus(paymentStatus);

        if (paymentStatus == Payment.PaymentStatus.SUCCESS) {
            // Update tickets to ACTIVE status
            List<Ticket> tickets = ticketRepository.findByBookingId(payment.getBooking().getId());
            for (Ticket ticket : tickets) {
                ticket.setStatus(Ticket.Status.ACTIVE);
                ticketRepository.save(ticket);
            }
        }

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new InvalidId(bookingId));
        return paymentMapper.toResponse(payment);
    }
}
