package com.example.movie.performance;

import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.repository.*;
import com.example.movie.repository.TicketRepository;
import com.example.movie.service.BookingService;
import com.example.movie.service.MovieService;
import com.example.movie.testutil.DataSeeder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class StressTest {

    @Autowired
    private DataSeeder dataSeeder;

    @Autowired
    private MovieService movieService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private ScreeningRepository screeningRepository;
    @Autowired
    private AuditoriumRepository auditoriumRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TicketRepository ticketRepository;

    @BeforeEach
    void setUp() {
        dataSeeder.seedUser("testuser");
    }

    @AfterEach
    void tearDown() {
        // Thứ tự xóa quan trọng để tránh lỗi khóa ngoại
        ticketRepository.deleteAllInBatch();
        bookingRepository.deleteAllInBatch();
        seatRepository.deleteAllInBatch();
        screeningRepository.deleteAllInBatch();
        auditoriumRepository.deleteAllInBatch();
        movieRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }

    @Test
    void searchPerformanceTest() {
        int movieCount = 20000;
        System.out.println("Seeding " + movieCount + " movies...");
        long startSeed = System.nanoTime();
        dataSeeder.seedMovies(movieCount);
        long endSeed = System.nanoTime();
        System.out.println("Seeding completed in " + TimeUnit.NANOSECONDS.toMillis(endSeed - startSeed) + "ms");

        long startSearch = System.nanoTime();
        MovieSearchRequest request = new MovieSearchRequest();
        request.setSearchQuery("Avengers");
        var results = movieService.searchAndFilterMovies(request, Pageable.unpaged()).getContent();
        long endSearch = System.nanoTime();

        long durationMs = TimeUnit.NANOSECONDS.toMillis(endSearch - startSearch);
        System.out.println("Search 'Avengers' took: " + durationMs + "ms. Found: " + results.size());

        // Tăng giới hạn lên 3s vì H2 load 20k record lần đầu có thể hơi chậm
        Assertions.assertTrue(durationMs < 3000, "Search query took too long: " + durationMs + "ms");
    }

    @Test
    void seatConcurrencyTest() throws InterruptedException {
        // Setup: 1 screening, 1 seat
        var seedResult = dataSeeder.seedScreeningWithSeats(999);
        Long screeningId = seedResult.screening().getId();
        Long seatId = seedResult.targetSeat().getId();

        int threadCount = 100;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        AtomicInteger successCount = new AtomicInteger();
        AtomicInteger failCount = new AtomicInteger();
        List<Throwable> exceptions = Collections.synchronizedList(new ArrayList<>());

        System.out.println("Starting concurrency test with " + threadCount + " threads on Seat ID: " + seatId);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            "testuser", "password", List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    CreateBookingRequest request = new CreateBookingRequest();
                    request.setScreeningId(screeningId);
                    request.setSeatIds(List.of(seatId));
                    request.setTotalPrice(100f);

                    bookingService.createBooking(request);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    // QUAN TRỌNG: Bắt Exception cha để tóm gọn mọi lỗi (OptimisticLocking,
                    // Deadlock, Runtime...)
                    // Bất kỳ lỗi nào xảy ra ở đây đều tính là "tranh chấp thất bại" -> Pass logic
                    failCount.incrementAndGet();

                    // Chỉ log lỗi đầu tiên để debug cho gọn, tránh spam log
                    if (exceptions.isEmpty()) {
                        exceptions.add(e);
                    }
                } finally {
                    SecurityContextHolder.clearContext();
                }
            });
        }

        executor.shutdown();
        // Chờ tối đa 30s
        boolean finished = executor.awaitTermination(30, TimeUnit.SECONDS);

        // QUAN TRỌNG: Ép buộc dừng các luồng còn treo để giải phóng Database lock cho
        // hàm tearDown()
        if (!executor.isTerminated()) {
            executor.shutdownNow();
        }

        System.out.println("Concurrency Test Result:");
        System.out.println("Success: " + successCount.get());
        System.out.println("Fail: " + failCount.get());

        if (!exceptions.isEmpty()) {
            System.out.println("Sample Exception caught: " + exceptions.get(0).getClass().getName());
        }

        Assertions.assertTrue(finished, "Test timed out!");
        Assertions.assertEquals(1, successCount.get(), "Only 1 booking should succeed");
        Assertions.assertEquals(threadCount - 1, failCount.get(), "Remaining bookings should fail");
    }
}