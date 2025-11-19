package com.example.movie.service.impl;

import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.dto.response.PageResponse;
import com.example.movie.mapper.MovieMapper;
import com.example.movie.model.Movie;
import com.example.movie.repository.MovieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MovieServiceImplTest {

    private MovieRepository movieRepository;
    private MovieMapper movieMapper;
    private MovieServiceImpl movieService;

    @BeforeEach
    void setUp() {
        movieRepository = Mockito.mock(MovieRepository.class);
        movieMapper = Mockito.mock(MovieMapper.class);
        movieService = new MovieServiceImpl(movieRepository, movieMapper);
    }

    @Test
    void searchAndFilterMovies_ShouldMapPagedResult() {
        Movie movie = new Movie();
        movie.setId(1L);
        Page<Movie> moviePage = new PageImpl<>(List.of(movie), PageRequest.of(0, 10), 1);
        when(movieRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(moviePage);

        MovieResponse mapped = MovieResponse.builder()
                .id(1L)
                .title("Interstellar")
                .build();
        when(movieMapper.toResponse(movie)).thenReturn(mapped);

        MovieSearchRequest searchRequest = MovieSearchRequest.builder()
                .searchQuery("Interstellar")
                .genre("Sci-Fi")
                .yearFrom(2010)
                .yearTo(2020)
                .status("COMING_SOON")
                .build();
        Pageable pageable = PageRequest.of(0, 10);

        PageResponse<MovieResponse> result = movieService.searchAndFilterMovies(searchRequest, pageable);

        assertThat(result.getContent()).containsExactly(mapped);
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getPageSize()).isEqualTo(10);

        ArgumentCaptor<Specification<Movie>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(movieRepository).findAll(specCaptor.capture(), Mockito.eq(pageable));
        assertThat(specCaptor.getValue()).isNotNull();
    }
}

