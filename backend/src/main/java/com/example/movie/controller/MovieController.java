package com.example.movie.controller;


import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.dto.movie.PatchMovie;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.response.PageResponse;
import com.example.movie.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    public ResponseEntity<ApiResponse<PageResponse<MovieResponse>>> getMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(required = false) String status
    ) {
        // Build search request
        MovieSearchRequest searchRequest = MovieSearchRequest.builder()
                .searchQuery(search)
                .genre(genre)
                .yearFrom(yearFrom)
                .yearTo(yearTo)
                .status(status)
                .build();
        
        // Build pageable with sorting
        Pageable pageable;
        if (sort != null && !sort.isBlank()) {
            // expect format field,ASC|DESC
            String[] parts = sort.split(",");
            String field = parts[0];
            Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("DESC"))
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            pageable = PageRequest.of(page, size, Sort.by(direction, field));
        } else {
            pageable = PageRequest.of(page, size);
        }
        
        PageResponse<MovieResponse> movies = movieService.searchAndFilterMovies(searchRequest, pageable);
        ApiResponse<PageResponse<MovieResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                movies,
                "get list success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
