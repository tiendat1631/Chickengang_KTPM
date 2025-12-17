package com.example.movie.integration;

import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class BookingPerformanceTest {

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
    private BookingRepository bookingRepository;

    @Test
    @Transactional
    public void testGetAllBookingsPerformance() {
        // 1. Setup Data - Insert 50 bookings
        User user = new User();
        user.setUsername("perf_user");
        user.setEmail("perf@test.com");
        user.setPassword("password");
        user.setAddress("Street");
        user.setPhoneNumber("1234567890");
        user.setRole(User.UserRole.CUSTOMER);
        userRepository.save(user);

        Movie movie = new Movie();
        movie.setTitle("Perf Movie");
        movie.setDirector("Dir");
        movie.setActors("Act");
        movie.setGenres("Gen");
        movie.setReleaseDate(LocalDate.now());
        movie.setDuration("100m");
        movie.setLanguage("Eng");
        movie.setRated("PG");
        movie.setDescription("Desc");
        movie.setStatus(MovieStatus.NOW_SHOWING);
        movieRepository.save(movie);

        Auditorium auditorium = new Auditorium();
        auditorium.setName("Hall Perf");
        auditorium.setCapacity(200);
        auditoriumRepository.save(auditorium);

        Screening screening = new Screening();
        screening.setMovie(movie);
        screening.setAuditorium(auditorium);
        screening.setStartTime(LocalDateTime.now());
        screening.setEndTime(LocalDateTime.now().plusHours(2));
        screening.setFormat(Screening.Format.TwoD);
        screening.setStatus(Screening.Status.ACTIVE);
        screeningRepository.save(screening);

        for (int i = 0; i < 50; i++) {
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setScreening(screening);
            booking.setBookingStatus(Booking.BookingStatus.PENDING);
            booking.setCreatedOn(LocalDateTime.now());
            booking.setBookingCode("BK-PERF-" + i);
            booking.setTotalPrice(100.0f);
            bookingRepository.save(booking);
        }

        // 2. Measure Execution Time
        long startTime = System.currentTimeMillis();
        bookingService.getAllBookings();
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        System.out.println("Execution time for searching 50 bookings: " + duration + "ms");

        // 3. Assert Performance Requirement (< 2000ms is generous for 50 items, but
        // ensures basic speed)
        assertTrue(duration < 2000, "Search took too long: " + duration + "ms");
    }
}
