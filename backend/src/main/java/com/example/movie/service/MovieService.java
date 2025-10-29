package com.example.movie.service;

import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.dto.movie.PatchMovie;
import com.example.movie.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface MovieService {
    MovieResponse addMovie(MovieRequest movieRequest);
    MovieResponse updateMovie(Long id, PatchMovie patchMovie);
    void deleteMovie(Long id);
    MovieResponse getMovieById(Long id);
    PageResponse<MovieResponse> searchAndFilterMovies(MovieSearchRequest searchRequest, Pageable pageable);
}
