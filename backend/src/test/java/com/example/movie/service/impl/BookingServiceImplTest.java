package com.example.movie.service.impl;

import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.exception.AuthenticationRequiredException;
import com.example.movie.exception.SeatNotAvailableException;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

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

@org.junit.jupiter.api.extension.ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class BookingServiceImplTest {

        @org.mockito.Mock
        private BookingRepository bookingRepository;

        @org.mockito.Mock
        private BookingMapper bookingMapper;

        @org.mockito.Mock
        private ScreeningRepository screeningRepository;

        @org.mockito.Mock
        private UserRepository userRepository;

        @org.mockito.Mock
        private SeatRepository seatRepository;

        @org.mockito.Mock
        private TicketRepository ticketRepository;

        @org.mockito.Mock
        private PaymentRepository paymentRepository;

        @org.mockito.InjectMocks
        private BookingServiceImpl bookingService;

        @BeforeEach
        void setUp() {
                // Mocks are initialized by @ExtendWith(MockitoExtension.class)
        }

        @AfterEach
        void tearDown() {
                SecurityContextHolder.clearContext();
        }

        @Test
        void createBooking_ShouldPersistBookingAndTickets() {
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(
                                                "owner",
                                                "password",
                                                List.of(() -> "ROLE_CUSTOMER")));

                User user = new User();
                user.setId(10L);
                user.setUsername("owner");

                Screening screening = new Screening();
                screening.setId(5L);
                screening.setMovie(new Movie());
                screening.setAuditorium(new Auditorium());

                Seat seat1 = new Seat();
                seat1.setId(1L);
                seat1.setRowLabel("A");
                seat1.setNumber(1);

                Seat seat2 = new Seat();
                seat2.setId(2L);
                seat2.setRowLabel("A");
                seat2.setNumber(2);

                when(userRepository.findByUsername("owner")).thenReturn(Optional.of(user));
                when(screeningRepository.findById(5L)).thenReturn(Optional.of(screening));
                when(seatRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(seat1, seat2));
                when(bookingRepository.count()).thenReturn(0L);
                when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
                        Booking saved = invocation.getArgument(0);
                        saved.setId(99L);
                        return saved;
                });
                when(bookingMapper.toResponse(any(Booking.class)))
                                .thenReturn(BookingResponse.builder().id(99L).build());

                CreateBookingRequest request = new CreateBookingRequest();
                request.setScreeningId(5L);
                request.setSeatIds(List.of(1L, 2L));
                request.setTotalPrice(200f);

                BookingResponse result = bookingService.createBooking(request);

                assertEquals(99L, result.getId());
                verify(bookingRepository).save(any(Booking.class));
                verify(ticketRepository, times(2)).save(any(Ticket.class));
        }

        @Test
        void createBooking_ShouldFailWhenSeatUnavailable() {
                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(
                                                "owner",
                                                "password",
                                                List.of(() -> "ROLE_CUSTOMER")));

                User user = new User();
                user.setUsername("owner");

                Screening screening = new Screening();
                screening.setId(5L);

                Seat seat1 = new Seat();
                seat1.setId(1L);

                Ticket reservedTicket = new Ticket();
                reservedTicket.setStatus(Ticket.Status.BOOKED);

                when(userRepository.findByUsername("owner")).thenReturn(Optional.of(user));
                when(screeningRepository.findById(5L)).thenReturn(Optional.of(screening));
                when(seatRepository.findAllById(List.of(1L))).thenReturn(List.of(seat1));
                when(ticketRepository.findByScreeningIdAndSeatId(5L, 1L)).thenReturn(reservedTicket);

                CreateBookingRequest request = new CreateBookingRequest();
                request.setScreeningId(5L);
                request.setSeatIds(List.of(1L));
                request.setTotalPrice(100f);

                assertThrows(SeatNotAvailableException.class, () -> bookingService.createBooking(request));
        }

        @Test
        void createBooking_ShouldRequireAuthentication() {
                CreateBookingRequest request = new CreateBookingRequest();
                request.setScreeningId(1L);
                request.setSeatIds(List.of(1L));
                request.setTotalPrice(100f);

                assertThrows(AuthenticationRequiredException.class, () -> bookingService.createBooking(request));
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
                                                List.of(() -> "ROLE_CUSTOMER")));

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
                                                List.of(() -> "ROLE_CUSTOMER")));

                assertThrows(AccessDeniedException.class, () -> bookingService.cancelBooking(2L));
        }

        @Test
        void cancelBooking_AdminCanCancelAnyBooking() {
                User user = new User();
                user.setUsername("customer");

                Booking booking = new Booking();
                booking.setId(3L);
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

                when(bookingRepository.findById(3L)).thenReturn(Optional.of(booking));
                when(paymentRepository.findByBookingId(3L)).thenReturn(Optional.of(payment));
                when(ticketRepository.findByBookingId(3L)).thenReturn(List.of(ticket));
                when(bookingRepository.save(booking)).thenReturn(booking);
                when(paymentRepository.save(payment)).thenReturn(payment);
                BookingResponse response = BookingResponse.builder().id(3L).build();
                when(bookingMapper.toResponse(any(Booking.class))).thenReturn(response);

                SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(
                                                "admin",
                                                "password",
                                                List.of(() -> "ROLE_ADMIN")));

                BookingResponse result = bookingService.cancelBooking(3L);

                assertSame(response, result);
                assertEquals(Booking.BookingStatus.CANCELLED, booking.getBookingStatus());
                verify(bookingRepository).save(booking);
        }
}
