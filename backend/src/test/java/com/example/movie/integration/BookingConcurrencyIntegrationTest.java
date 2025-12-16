package com.example.movie.integration;

import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.exception.SeatNotAvailableException;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.BookingService;
import com.example.movie.testutil.TestContainersConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
@Import(TestContainersConfig.class)
public class BookingConcurrencyIntegrationTest extends TestContainersConfig {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private AuditoriumRepository auditoriumRepository;

    @Autowired
    private ScreeningRepository screeningRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private Long screeningId;
    private Long seatId;
    private Long user1Id;
    private Long user2Id;

    @BeforeEach
    void setUp() {
        // Clean up
        ticketRepository.deleteAll();
        bookingRepository.deleteAll();
        seatRepository.deleteAll();
        screeningRepository.deleteAll();
        userRepository.deleteAll();
        auditoriumRepository.deleteAll();
        movieRepository.deleteAll();

        // Setup User 1
        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@test.com");
        user1.setPassword("password");
        user1Id = userRepository.save(user1).getId();

        // Setup User 2
        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("user2@test.com");
        user2.setPassword("password");
        user2Id = userRepository.save(user2).getId();

        // Setup Movie
        Movie movie = new Movie();
        movie.setTitle("Test Movie");
        movie.setDuration("120");
        movie.setDirector("Director");
        movie.setActors("Actor");
        movie.setGenres("Action");
        movie.setReleaseDate(java.time.LocalDate.now());
        movie.setLanguage("English");
        movie.setRated("PG-13");
        movie.setDescription("Description");
        movie.setStatus(MovieStatus.NOW_SHOWING);
        movie = movieRepository.save(movie);

        // Setup Auditorium
        Auditorium auditorium = new Auditorium();
        auditorium.setName("Hall 1");
        auditorium = auditoriumRepository.save(auditorium);

        // Setup Screening
        Screening screening = new Screening();
        screening.setMovie(movie);
        screening.setAuditorium(auditorium);
        screening.setStartTime(java.time.LocalDateTime.now().plusHours(1));
        screeningId = screeningRepository.save(screening).getId();

        // Setup Seat
        Seat seat = new Seat();
        seat.setAuditorium(auditorium);
        seat.setRowLabel("A");
        seat.setNumber(1);
        seatId = seatRepository.save(seat).getId();
    }

    @Test
    void concurrentBooking_ShouldPreventDoubleBooking() throws InterruptedException {
        int numberOfThreads = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        // Define task
        java.util.function.Consumer<Long> bookingTask = (userId) -> {
            try {
                // Mock Authentication for this thread
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(
                                userId.equals(user1Id) ? "user1" : "user2",
                                "password",
                                java.util.List.of(() -> "ROLE_CUSTOMER")));
                CreateBookingRequest request = new CreateBookingRequest();
                request.setScreeningId(screeningId);
                request.setSeatIds(List.of(seatId));
                request.setTotalPrice(100.0f);

                bookingService.createBooking(request);
                successCount.incrementAndGet();
            } catch (Exception e) {
                // e.printStackTrace();
                // We expect one of them to fail
                failCount.incrementAndGet();
            } finally {
                latch.countDown();
                SecurityContextHolder.clearContext();
            }
        };

        // Submit tasks
        executorService.submit(() -> bookingTask.accept(user1Id));
        executorService.submit(() -> bookingTask.accept(user2Id));

        // Wait for completion
        latch.await(10, TimeUnit.SECONDS);

        // Verification
        // Ideally: 1 success, 1 fail.
        // Currently (Buggy): Likely 2 success (Double Booking) or inconsistent results.
        System.out.println("Success: " + successCount.get());
        System.out.println("Fail: " + failCount.get());

        assertEquals(1, successCount.get(), "Only one booking should succeed");
        assertEquals(1, failCount.get(), "One booking should fail due to concurrency");
    }
}
