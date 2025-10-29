package com.example.movie.service.impl;

import com.example.movie.mapper.MovieMapper;
import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.MovieSearchRequest;
import com.example.movie.dto.movie.PatchMovie;
import com.example.movie.dto.response.PageResponse;
import com.example.movie.exception.InvalidId;
import com.example.movie.model.Movie;
import com.example.movie.repository.MovieRepository;
import com.example.movie.service.MovieService;
import com.example.movie.specification.MovieSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    @Override
    public MovieResponse addMovie (MovieRequest movieRequest) {
        Movie movie = movieMapper.toEntity(movieRequest);
        Movie saved = movieRepository.save(movie);
        return movieMapper.toResponse(saved);
    }

    @Override
    public MovieResponse updateMovie (Long id,PatchMovie moviePatch) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));

        if (moviePatch.getTitle() != null) {
            existingMovie.setTitle(moviePatch.getTitle());
        }
        if(moviePatch.getDirector() != null) {
            existingMovie.setDirector(moviePatch.getDirector());
        }
        if(moviePatch.getActors() != null) {
            existingMovie.setActors(moviePatch.getActors());
        }
        if(moviePatch.getGenres() != null) {
            existingMovie.setGenres(moviePatch.getGenres());
        }
        if(moviePatch.getReleaseDate() != null) {
            existingMovie.setReleaseDate(moviePatch.getReleaseDate());
        }
        if (moviePatch.getDuration() != null) {
            existingMovie.setDuration(moviePatch.getDuration());
        }
        if(moviePatch.getLanguage() != null) {
            existingMovie.setLanguage(moviePatch.getLanguage());
        }
        if(moviePatch.getRated() != null) {
            existingMovie.setRated(moviePatch.getRated());
        }
        if(moviePatch.getDescription() != null) {
            existingMovie.setDescription(moviePatch.getDescription());
        }
        if(moviePatch.getStatus() != null) {
            existingMovie.setStatus(moviePatch.getStatus());
        }
        Movie saved = movieRepository.save(existingMovie);
        return movieMapper.toResponse(saved);

    }

    @Override
    public void deleteMovie (Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));

        movieRepository.delete(movie);
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        return movieMapper.toResponse(movie);
    }

    @Override
    public PageResponse<MovieResponse> searchAndFilterMovies(MovieSearchRequest searchRequest, Pageable pageable) {
        // Build specifications
        Specification<Movie> spec = Specification.where(null);
        
        if (searchRequest.getSearchQuery() != null && !searchRequest.getSearchQuery().trim().isEmpty()) {
            spec = spec.and(MovieSpecification.searchByKeyword(searchRequest.getSearchQuery()));
        }
        
        if (searchRequest.getGenre() != null && !searchRequest.getGenre().trim().isEmpty()) {
            spec = spec.and(MovieSpecification.filterByGenre(searchRequest.getGenre()));
        }
        
        if (searchRequest.getYearFrom() != null || searchRequest.getYearTo() != null) {
            spec = spec.and(MovieSpecification.filterByYearRange(searchRequest.getYearFrom(), searchRequest.getYearTo()));
        }
        
        if (searchRequest.getStatus() != null && !searchRequest.getStatus().trim().isEmpty()) {
            spec = spec.and(MovieSpecification.filterByStatus(searchRequest.getStatus()));
        }
        
        // Execute query with pagination
        Page<Movie> moviePage = movieRepository.findAll(spec, pageable);
        
        // Convert to PageResponse
        List<MovieResponse> content = moviePage.getContent()
                .stream()
                .map(movieMapper::toResponse)
                .collect(Collectors.toList());
        
        return PageResponse.<MovieResponse>builder()
                .content(content)
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .currentPage(moviePage.getNumber())
                .pageSize(moviePage.getSize())
                .hasNext(moviePage.hasNext())
                .hasPrevious(moviePage.hasPrevious())
                .build();
    }


}
