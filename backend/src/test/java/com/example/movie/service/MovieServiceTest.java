package com.example.movie.service;

import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.dto.response.PageResponse;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.MovieMapper;
import com.example.movie.model.Movie;
import com.example.movie.repository.MovieRepository;
import com.example.movie.service.impl.MovieServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private MovieMapper movieMapper;

    @InjectMocks
    private MovieServiceImpl movieService;

    private Movie movie;
    private MovieResponse movieResponse;

    @BeforeEach
    void setUp() {
        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Test Movie");

        movieResponse = new MovieResponse();
        movieResponse.setId(1L);
        movieResponse.setTitle("Test Movie");
    }

    @Test
    void getMovieById_ShouldReturnMovie_WhenExists() {
        // Given
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(movieMapper.toResponse(movie)).thenReturn(movieResponse);

        // When
        MovieResponse result = movieService.getMovieById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getMovieById_ShouldThrowException_WhenNotFound() {
        // Given
        when(movieRepository.findById(99L)).thenReturn(Optional.empty());

        // When
        Throwable thrown = catchThrowable(() -> movieService.getMovieById(99L));

        // Then
        assertThat(thrown).isInstanceOf(InvalidId.class);
    }

    @Test
    void searchAndFilterMovies_ShouldReturnPagedResult() {
        // Given
        MovieSearchRequest searchRequest = new MovieSearchRequest();
        searchRequest.setSearchQuery("Test");

        Page<Movie> moviePage = new PageImpl<>(Collections.singletonList(movie));
        when(movieRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(moviePage);
        when(movieMapper.toResponse(movie)).thenReturn(movieResponse);

        // When
        PageResponse<MovieResponse> result = movieService.searchAndFilterMovies(searchRequest, Pageable.unpaged());

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
    }
}
