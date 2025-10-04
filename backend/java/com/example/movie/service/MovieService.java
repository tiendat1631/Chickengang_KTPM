package com.example.movie.service;

import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.PatchMovie;

public interface MovieService {
    MovieResponse addMovie(MovieRequest movieRequest);
    MovieResponse updateMovie(Long id, PatchMovie patchMovie);
    void deleteMovie(Long id);
    MovieResponse getMovieById(Long id);
}
