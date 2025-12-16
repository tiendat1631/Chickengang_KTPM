package com.example.movie.repository;

import com.example.movie.model.Movie;
import com.example.movie.model.MovieStatus;
import com.example.movie.specification.MovieSpecification; // Ensure this import is correct based on previous file view
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test") // Use application-test.properties if available, or default to embedded H2
                        // usually provided by @DataJpaTest
public class MovieRepositoryTest {

    @Autowired
    private MovieRepository movieRepository;

    @BeforeEach
    void setUp() {
        movieRepository.deleteAll();

        Movie movie1 = new Movie();
        movie1.setTitle("Avengers: Endgame");
        movie1.setDirector("Russo Brothers");
        movie1.setActors("Robert Downey Jr., Chris Evans");
        movie1.setGenres("Action, Sci-Fi");
        movie1.setReleaseDate(LocalDate.of(2019, 4, 26));
        movie1.setDuration("181 min");
        movie1.setLanguage("English");
        movie1.setRated("PG-13");
        movie1.setDescription("After the devastating events of Infinity War...");
        movie1.setStatus(MovieStatus.NOW_SHOWING);
        movieRepository.save(movie1);

        Movie movie2 = new Movie();
        movie2.setTitle("The Hangover");
        movie2.setDirector("Todd Phillips");
        movie2.setActors("Bradley Cooper, Ed Helms");
        movie2.setGenres("Comedy");
        movie2.setReleaseDate(LocalDate.of(2009, 6, 5));
        movie2.setDuration("100 min");
        movie2.setLanguage("English");
        movie2.setRated("R");
        movie2.setDescription("Three buddies wake up from a bachelor party...");
        movie2.setStatus(MovieStatus.COMING_SOON);
        movieRepository.save(movie2);
    }

    @Test
    void shouldFindMoviesByTitleContaining_WhenKeywordMatches() {
        // Given
        Specification<Movie> spec = MovieSpecification.searchByKeyword("Avengers");

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("Avengers: Endgame");
    }

    @Test
    void shouldFindMoviesByActor_WhenKeywordMatches() {
        // Given
        Specification<Movie> spec = MovieSpecification.searchByKeyword("Bradley");

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("The Hangover");
    }

    @Test
    void shouldFilterByGenre_WhenGenreMatches() {
        // Given
        Specification<Movie> spec = MovieSpecification.filterByGenre("Action");

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getGenres()).contains("Action");
    }

    @Test
    void shouldFilterByStatus_WhenStatusMatches() {
        // Given
        Specification<Movie> spec = MovieSpecification.filterByStatus("COMING_SOON");

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStatus()).isEqualTo(MovieStatus.COMING_SOON);
    }

    @Test
    void shouldReturnEmpty_WhenNoMatch() {
        // Given
        Specification<Movie> spec = MovieSpecification.searchByKeyword("NonExistentMovie");

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        assertThat(results).isEmpty();
    }

    @Test
    void shouldFilterByMultipleCriteria() {
        // Given: Filter by Genre "Action" and Release Year >= 2019
        Specification<Movie> spec = Specification.where(MovieSpecification.filterByGenre("Action"))
                .and(MovieSpecification.filterByYearRange(2019, null));

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).isEqualTo("Avengers: Endgame");
    }

    @Test
    void shouldSortMoviesByTitle_Ascending() {
        // Given
        Specification<Movie> spec = Specification.where(null);
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.ASC, "title");

        // When
        List<Movie> results = movieRepository.findAll(spec, sort);

        // Then
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getTitle()).isEqualTo("Avengers: Endgame"); // A comes before T
        assertThat(results.get(1).getTitle()).isEqualTo("The Hangover");
    }

    @Test
    void shouldSortMoviesByReleaseDate_Descending() {
        // Given
        Specification<Movie> spec = Specification.where(null);
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "releaseDate");

        // When
        List<Movie> results = movieRepository.findAll(spec, sort);

        // Then
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getTitle()).isEqualTo("Avengers: Endgame"); // 2019
        assertThat(results.get(1).getTitle()).isEqualTo("The Hangover"); // 2009
    }

    @Test
    void shouldNotReturnResults_WhenSqlInjectionAttempted() {
        // Given: A common SQL Injection payload
        String sqlInjectionPayload = "Avengers' OR '1'='1";
        Specification<Movie> spec = MovieSpecification.searchByKeyword(sqlInjectionPayload);

        // When
        List<Movie> results = movieRepository.findAll(spec);

        // Then
        // Should treat payload as literal string "Avengers' OR '1'='1"
        // and NOT execute the OR condition which would return all movies.
        assertThat(results).isEmpty();
    }

    @Test
    void shouldExecuteSearchQueryEfficiently() {
        // Given
        Specification<Movie> spec = MovieSpecification.searchByKeyword("Avengers");
        int iterations = 100;

        // When
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < iterations; i++) {
            movieRepository.findAll(spec);
        }
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Then
        // 100 queries should definitely complete within 2 seconds (2000ms) even on
        // slower environments
        assertThat(duration).isLessThan(2000);
    }
}
