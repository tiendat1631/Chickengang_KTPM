package com.example.movie.service.impl;

import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceImplTest {

    private BookingRepository bookingRepository;
    private BookingMapper bookingMapper;
    private ScreeningRepository screeningRepository;
    private UserRepository userRepository;
    private SeatRepository seatRepository;
    private TicketRepository ticketRepository;
    private PaymentRepository paymentRepository;
    private BookingServiceImpl bookingService;

    @BeforeEach
    void setUp() {
        bookingRepository = Mockito.mock(BookingRepository.class);
        bookingMapper = Mockito.mock(BookingMapper.class);
        screeningRepository = Mockito.mock(ScreeningRepository.class);
        userRepository = Mockito.mock(UserRepository.class);
        seatRepository = Mockito.mock(SeatRepository.class);
        ticketRepository = Mockito.mock(TicketRepository.class);
        paymentRepository = Mockito.mock(PaymentRepository.class);

        bookingService = new BookingServiceImpl(
                bookingRepository,
                bookingMapper,
                screeningRepository,
                userRepository,
                seatRepository,
                ticketRepository,
                paymentRepository
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void cancelBooking_ShouldReleaseTicketsAndUpdateStatuses() {
        User user = new User();
        user.setUsername("owner");

        Booking booking = new Booking();
        booking.setId(1L);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setUser(user);
        Screening screening = new Screening();
        screening.setMovie(new Movie());
        screening.setAuditorium(new Auditorium());
        booking.setScreening(screening);

        Payment payment = new Payment();
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setBooking(booking);

        Ticket ticket = new Ticket();
        ticket.setStatus(Ticket.Status.BOOKED);
        ticket.setSeat(new Seat());

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(paymentRepository.findByBookingId(1L)).thenReturn(Optional.of(payment));
        when(ticketRepository.findByBookingId(1L)).thenReturn(List.of(ticket));
        when(paymentRepository.save(payment)).thenReturn(payment);
        when(bookingRepository.save(booking)).thenReturn(booking);
        BookingResponse response = BookingResponse.builder().id(1L).build();
        when(bookingMapper.toResponse(any(Booking.class))).thenReturn(response);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "owner",
                        "password",
                        List.of(() -> "ROLE_CUSTOMER")
                )
        );

        BookingResponse result = bookingService.cancelBooking(1L);

        assertSame(response, result);
        assertEquals(Booking.BookingStatus.CANCELLED, booking.getBookingStatus());
        assertEquals(Payment.PaymentStatus.CANCELLED, payment.getStatus());
        assertEquals(Ticket.Status.AVAILABLE, ticket.getStatus());
        verify(ticketRepository, times(1)).save(ticket);
        verify(paymentRepository).save(payment);
        verify(bookingRepository).save(booking);
    }

    @Test
    void cancelBooking_ShouldThrowWhenUserIsNotOwner() {
        User user = new User();
        user.setUsername("owner");

        Booking booking = new Booking();
        booking.setId(2L);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setUser(user);

        when(bookingRepository.findById(2L)).thenReturn(Optional.of(booking));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "other",
                        "password",
                        List.of(() -> "ROLE_CUSTOMER")
                )
        );

        assertThrows(AccessDeniedException.class, () -> bookingService.cancelBooking(2L));
    }
}

