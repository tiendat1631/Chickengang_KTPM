package com.example.movie.testutil;

import com.example.movie.model.*;
import com.example.movie.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final MovieRepository movieRepository;
    private final ScreeningRepository screeningRepository;
    private final SeatRepository seatRepository;
    private final AuditoriumRepository auditoriumRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    // Seed 10,000 movies
    @Transactional
    public void seedMovies(int count) {
        List<Movie> movies = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < count; i++) {
            String title = (i % 100 == 0) ? "Avengers: Age of " + i : "Movie Title " + i;
            Movie movie = new Movie();
            movie.setTitle(title);
            movie.setDescription("Description for " + title);
            movie.setDuration("120"); // Changed to String
            movie.setReleaseDate(LocalDate.now().minusDays(random.nextInt(365)));
            movie.setGenres(random.nextBoolean() ? "Action" : "Drama"); // Changed to setGenres
            // Removed non-existent fields: voteAverage, voteCount, posterPath,
            // backdropPath, popularity
            movie.setDirector("Director " + i);
            movie.setActors("Actor " + i);
            movie.setLanguage("English");
            movie.setRated("PG-13");
            movie.setStatus(MovieStatus.NOW_SHOWING); // Assuming enum exists or null

            movies.add(movie);

            // Save in batches to avoid memory issues (simple approach: save every 1000)
            if (movies.size() >= 1000) {
                movieRepository.saveAll(movies);
                movies.clear();
            }
        }

        if (!movies.isEmpty()) {
            movieRepository.saveAll(movies);
        }
    }

    @Transactional
    public void seedUser(String username) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword("password");
            user.setEmail(username + "@example.com");
            user.setPhoneNumber("1234567890"); // Fixed
            user.setAddress("123 Test St"); // Added required field
            user.setRole(User.UserRole.CUSTOMER); // Added required field
            // user.setFullName(...) removed as it does not exist
            userRepository.save(user);
        }
    }

    // Setup a screening with full seats for concurrency test
    @Transactional
    public ScreeningSeedResult seedScreeningWithSeats(int auditoriumId) {
        // Create or find auditorium
        Auditorium auditorium = auditoriumRepository.findById((long) auditoriumId)
                .orElseGet(() -> {
                    Auditorium a = new Auditorium();
                    // a.setId((long) auditoriumId); // Removed to allow DB generation
                    a.setName("Hall " + auditoriumId);
                    a.setCapacity(100);
                    return auditoriumRepository.save(a);
                });

        // Create movie
        Movie movie = new Movie();
        movie.setTitle("Concurrency Test Movie");
        movie.setDuration("120");
        movie.setReleaseDate(LocalDate.now());
        movie.setDirector("Director");
        movie.setActors("Actors");
        movie.setGenres("Action");
        movie.setLanguage("EN");
        movie.setRated("PG");
        movie.setDescription("Desc");
        movie.setStatus(MovieStatus.NOW_SHOWING);
        movie = movieRepository.save(movie);

        // Create screening
        Screening screening = new Screening();
        screening.setMovie(movie);
        screening.setAuditorium(auditorium);
        screening.setStartTime(LocalDateTime.now().plusHours(1));
        screening.setEndTime(LocalDateTime.now().plusHours(3));
        screening.setFormat(Screening.Format.TwoD);
        screening.setStatus(Screening.Status.ACTIVE);
        screening = screeningRepository.save(screening);

        // Create seats
        List<Seat> seats = new ArrayList<>();
        // Removed unused finalScreening
        Auditorium finalAuditorium = auditorium;
        IntStream.range(1, 101).forEach(i -> {
            Seat seat = new Seat();
            seat.setAuditorium(finalAuditorium);
            seat.setRowLabel("A");
            seat.setNumber(i);
            seat.setSeatType(Seat.SeatType.NORMAL);
            seats.add(seat);
        });
        seatRepository.saveAll(seats);

        // Return the first seat for testing
        return new ScreeningSeedResult(screening, seats.get(0));
    }

    public record ScreeningSeedResult(Screening screening, Seat targetSeat) {
    }
}
