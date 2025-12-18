package com.example.movie.integration;

import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class BookingSecurityTest {

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
    @Autowired
    private PaymentRepository paymentRepository;

    private User ownerUser;
    private User otherUser;
    private Long ownerBookingId;

    @BeforeEach
    void setUp() {
        bookingRepository.deleteAll();
        paymentRepository.deleteAll();
        userRepository.deleteAll();
        screeningRepository.deleteAll();

        // 1. Setup Users
        ownerUser = new User();
        ownerUser.setUsername("owner");
        ownerUser.setEmail("owner@test.com");
        ownerUser.setPassword("password");
        ownerUser.setAddress("123 Owner St");
        ownerUser.setPhoneNumber("0987654321");
        ownerUser.setRole(User.UserRole.CUSTOMER);
        ownerUser = userRepository.save(ownerUser);

        otherUser = new User();
        otherUser.setUsername("hacker");
        otherUser.setEmail("hacker@test.com");
        otherUser.setPassword("password");
        otherUser.setAddress("456 Hacker St");
        otherUser.setPhoneNumber("0123456789");
        otherUser.setRole(User.UserRole.CUSTOMER);
        otherUser = userRepository.save(otherUser);

        // 2. Setup Movie & Screening
        Movie movie = new Movie();
        movie.setTitle("Test Movie");
        movie.setDirector("Director");
        movie.setActors("Actors");
        movie.setGenres("Action");
        movie.setReleaseDate(java.time.LocalDate.now());
        movie.setDuration("120m");
        movie.setLanguage("English");
        movie.setRated("PG-13");
        movie.setDescription("Desc");
        movie.setStatus(MovieStatus.NOW_SHOWING);
        movie = movieRepository.save(movie);

        Auditorium auditorium = new Auditorium();
        auditorium.setName("Hall 1");
        auditorium.setCapacity(100);
        auditorium = auditoriumRepository.save(auditorium);

        Screening screening = new Screening();
        screening.setMovie(movie);
        screening.setAuditorium(auditorium);
        screening.setStartTime(LocalDateTime.now().plusDays(1));
        screening = screeningRepository.save(screening);

        // 3. Create Booking for Owner
        Booking booking = new Booking();
        booking.setUser(ownerUser);
        booking.setScreening(screening);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setCreatedOn(LocalDateTime.now());
        booking.setBookingCode("BK-OWNER-01");
        booking.setTotalPrice(100.0f);
        booking = bookingRepository.save(booking);
        ownerBookingId = booking.getId();

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setAmount(100.0f);
        payment.setPaymentMethod("CREDIT_CARD");
        paymentRepository.save(payment);
    }

    @Test
    void testCancelBooking_IDOR_ShouldFail() {
        // Authenticate as "otherUser"
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("hacker", "password", null));

        // Try to cancel owner's booking
        assertThrows(AccessDeniedException.class, () -> {
            bookingService.cancelBooking(ownerBookingId);
        });
    }

    /**
     * M3-33: IDOR Prevention for Viewing
     * Note: If this fails, it means specific IDOR protection logic is missing in
     * getBooking.
     */
    @Test
    void testGetBooking_IDOR_ShouldFail() {
        // Authenticate as "otherUser"
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("hacker", "password", null));

        // HACKER tries to view OWNER's booking
        // If system is secure, this should throw AccessDeniedException or similar
        // Based on code review, we suspect this might fail (allow access)
        assertThrows(AccessDeniedException.class, () -> {
            bookingService.getBooking(ownerBookingId);
        });
    }
}
