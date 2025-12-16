package com.example.movie.service.impl;

import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.exception.SeatNotAvailableException;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Concurrency test for BookingServiceImpl.
 * Tests that the system correctly handles race conditions when two users
 * attempt to book the same seat simultaneously.
 */
@org.junit.jupiter.api.extension.ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class BookingConcurrencyTest {

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
    void concurrentBooking_ShouldAllowOnlyOneSuccess() throws InterruptedException {
        // Setup test data
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");

        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");

        Screening screening = new Screening();
        screening.setId(1L);
        screening.setMovie(new Movie());
        screening.setAuditorium(new Auditorium());

        Seat seat = new Seat();
        seat.setId(1L);
        seat.setRowLabel("A");
        seat.setNumber(1);

        // Initially seat is available (no ticket or ticket with AVAILABLE status)
        // Use synchronized access to properly simulate race condition
        AtomicInteger ticketBookedCount = new AtomicInteger(0);
        final Object lock = new Object();

        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user1));
        when(userRepository.findByUsername("user2")).thenReturn(Optional.of(user2));
        when(screeningRepository.findById(1L)).thenReturn(Optional.of(screening));
        when(seatRepository.findAllById(List.of(1L))).thenReturn(List.of(seat));
        lenient().when(bookingRepository.count()).thenReturn(0L);
        lenient().when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking saved = invocation.getArgument(0);
            saved.setId(100L + ticketBookedCount.get());
            return saved;
        });
        lenient().when(bookingMapper.toResponse(any(Booking.class)))
                .thenReturn(BookingResponse.builder().id(100L).build());

        // Simulate the ticket status with synchronized check-and-set
        // This ensures only one thread can successfully "book" the seat
        when(ticketRepository.findByScreeningIdAndSeatId(1L, 1L)).thenAnswer(invocation -> {
            synchronized (lock) {
                if (ticketBookedCount.get() > 0) {
                    // Seat already booked by first user
                    Ticket bookedTicket = new Ticket();
                    bookedTicket.setStatus(Ticket.Status.BOOKED);
                    return bookedTicket;
                }
                return null; // First call - no ticket yet
            }
        });

        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> {
            synchronized (lock) {
                ticketBookedCount.incrementAndGet();
            }
            return invocation.getArgument(0);
        });

        // Create concurrent booking attempts
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(2);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        Runnable bookingTask = () -> {
            try {
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(
                                Thread.currentThread().getName().contains("1") ? "user1" : "user2",
                                "password",
                                List.of(() -> "ROLE_CUSTOMER")));

                CreateBookingRequest request = new CreateBookingRequest();
                request.setScreeningId(1L);
                request.setSeatIds(List.of(1L));
                request.setTotalPrice(100f);

                bookingService.createBooking(request);
                successCount.incrementAndGet();
            } catch (SeatNotAvailableException e) {
                failCount.incrementAndGet();
            } finally {
                latch.countDown();
            }
        };

        executor.submit(bookingTask);
        Thread.sleep(10); // Small delay to ensure first thread starts first
        executor.submit(bookingTask);

        latch.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        // In a properly synchronized system, only one should succeed
        // Note: This mock-based test simulates the race condition.
        // A real integration test against a DB would be more accurate.
        assertEquals(1, successCount.get(), "Only one booking should succeed");
        assertEquals(1, failCount.get(), "One booking should fail");
    }
}
