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
}

