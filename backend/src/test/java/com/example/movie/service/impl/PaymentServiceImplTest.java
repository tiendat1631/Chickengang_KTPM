package com.example.movie.service.impl;

import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.dto.payment.PaymentUpdateRequest;
import com.example.movie.exception.AuthenticationRequiredException;
import com.example.movie.mapper.PaymentMapper;
import com.example.movie.model.*;
import com.example.movie.repository.BookingRepository;
import com.example.movie.repository.PaymentRepository;
import com.example.movie.repository.TicketRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PaymentServiceImplTest {

    private PaymentRepository paymentRepository;
    private BookingRepository bookingRepository;
    private TicketRepository ticketRepository;
    private PaymentMapper paymentMapper;
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        paymentRepository = Mockito.mock(PaymentRepository.class);
        bookingRepository = Mockito.mock(BookingRepository.class);
        ticketRepository = Mockito.mock(TicketRepository.class);
        paymentMapper = Mockito.mock(PaymentMapper.class);

        paymentService = new PaymentServiceImpl(
                paymentRepository,
                bookingRepository,
                ticketRepository,
                paymentMapper
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updatePendingPayment_ShouldUpdateMethodAndNote() {
        Payment payment = new Payment();
        payment.setId(5L);
        payment.setStatus(Payment.PaymentStatus.PENDING);

        User user = new User();
        user.setUsername("customer");

        Booking booking = new Booking();
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setUser(user);
        payment.setBooking(booking);

        when(paymentRepository.findById(5L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);
        PaymentResponse response = new PaymentResponse();
        when(paymentMapper.toResponse(payment)).thenReturn(response);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "customer",
                        "password",
                        List.of(() -> "ROLE_CUSTOMER")
                )
        );

        PaymentUpdateRequest request = new PaymentUpdateRequest("BANK_TRANSFER", "Switching");

        PaymentResponse result = paymentService.updatePendingPayment(5L, request);

        assertSame(response, result);
        assertEquals("BANK_TRANSFER", payment.getPaymentMethod());
        assertEquals("Switching", payment.getNote());
        verify(paymentRepository).save(payment);
    }

    @Test
    void updatePendingPayment_ShouldThrowWhenUnauthorized() {
        Payment payment = new Payment();
        payment.setStatus(Payment.PaymentStatus.PENDING);

        User user = new User();
        user.setUsername("owner");

        Booking booking = new Booking();
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setUser(user);
        payment.setBooking(booking);

        when(paymentRepository.findById(7L)).thenReturn(Optional.of(payment));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "other",
                        "password",
                        List.of(() -> "ROLE_CUSTOMER")
                )
        );

        PaymentUpdateRequest request = new PaymentUpdateRequest("CASH", null);

        assertThrows(AccessDeniedException.class, () -> paymentService.updatePendingPayment(7L, request));
    }

    @Test
    void updatePendingPayment_AdminCanUpdateOtherUserPayment() {
        Payment payment = new Payment();
        payment.setId(8L);
        payment.setStatus(Payment.PaymentStatus.PENDING);

        User user = new User();
        user.setUsername("owner");

        Booking booking = new Booking();
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setUser(user);
        payment.setBooking(booking);

        when(paymentRepository.findById(8L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);
        PaymentResponse response = new PaymentResponse();
        when(paymentMapper.toResponse(payment)).thenReturn(response);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin",
                        "password",
                        List.of(() -> "ROLE_ADMIN")
                )
        );

        PaymentUpdateRequest request = new PaymentUpdateRequest("CASH", "admin override");

        PaymentResponse result = paymentService.updatePendingPayment(8L, request);

        assertSame(response, result);
        assertEquals("CASH", payment.getPaymentMethod());
        assertEquals("admin override", payment.getNote());
    }

    @Test
    void completePayment_ShouldUpdateBookingAndTicketsOnSuccess() {
        Booking booking = new Booking();
        booking.setId(3L);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);

        Payment payment = new Payment();
        payment.setId(9L);
        payment.setBooking(booking);
        payment.setStatus(Payment.PaymentStatus.PENDING);

        Ticket ticket = new Ticket();
        ticket.setStatus(Ticket.Status.BOOKED);
        ticket.setBooking(booking);

        when(paymentRepository.findById(9L)).thenReturn(Optional.of(payment));
        when(ticketRepository.findByBookingId(3L)).thenReturn(List.of(ticket));
        when(paymentRepository.save(payment)).thenReturn(payment);
        when(bookingRepository.save(booking)).thenReturn(booking);
        PaymentResponse response = new PaymentResponse();
        when(paymentMapper.toResponse(payment)).thenReturn(response);

        PaymentResponse result = paymentService.completePayment(9L, "SUCCESS");

        assertSame(response, result);
        assertEquals(Payment.PaymentStatus.SUCCESS, payment.getStatus());
        assertEquals(Booking.BookingStatus.PAID, booking.getBookingStatus());
        assertEquals(Ticket.Status.ISSUED, ticket.getStatus());
        verify(ticketRepository).save(ticket);
        verify(bookingRepository).save(booking);
    }

    @Test
    void completePayment_ShouldCancelBookingWhenFailed() {
        Booking booking = new Booking();
        booking.setId(4L);
        booking.setScreening(new Screening());
        booking.setBookingStatus(Booking.BookingStatus.PENDING);

        Payment payment = new Payment();
        payment.setId(10L);
        payment.setBooking(booking);
        payment.setStatus(Payment.PaymentStatus.PENDING);

        Ticket ticket = new Ticket();
        ticket.setStatus(Ticket.Status.BOOKED);
        ticket.setBooking(booking);

        when(paymentRepository.findById(10L)).thenReturn(Optional.of(payment));
        when(ticketRepository.findByBookingId(4L)).thenReturn(List.of(ticket));
        when(paymentRepository.save(payment)).thenReturn(payment);
        when(bookingRepository.save(booking)).thenReturn(booking);
        PaymentResponse response = new PaymentResponse();
        when(paymentMapper.toResponse(payment)).thenReturn(response);

        PaymentResponse result = paymentService.completePayment(10L, "FAILED");

        assertSame(response, result);
        assertEquals(Payment.PaymentStatus.FAILED, payment.getStatus());
        assertEquals(Booking.BookingStatus.CANCELLED, booking.getBookingStatus());
        assertEquals(Ticket.Status.AVAILABLE, ticket.getStatus());
        verify(ticketRepository).save(ticket);
        verify(bookingRepository).save(booking);
    }
}

