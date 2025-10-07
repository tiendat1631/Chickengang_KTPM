package com.example.movie.controller;


import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.PatchMovie;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.model.Movie;
import com.example.movie.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/movies")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MovieController {
    private final MovieService movieService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponse>> addMovie(@RequestBody MovieRequest movieRequest) {
        MovieResponse created = movieService.addMovie(movieRequest);
        ApiResponse<MovieResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "add success",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(@PathVariable Long id,@Valid @RequestBody  PatchMovie patchMovie) {
        MovieResponse updated = movieService.updateMovie(id, patchMovie);
        ApiResponse<MovieResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                updated,
                "update success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id){
        movieService.deleteMovie(id);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.OK,
                null,
                "delete success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id){
        MovieResponse getMovie = movieService.getMovieById(id);
        ApiResponse<MovieResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                getMovie,
                "get success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort
    ) {
        List<MovieResponse> movies = movieService.getMovies(page, size, sort);
        ApiResponse<List<MovieResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                movies,
                "get list success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
