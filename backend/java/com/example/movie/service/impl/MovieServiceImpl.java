package com.example.movie.service.impl;

import com.example.movie.Mapper.MovieMapper;
import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.dto.movie.PatchMovie;
import com.example.movie.exception.InvalidId;
import com.example.movie.model.Movie;
import com.example.movie.repository.MovieRepository;
import com.example.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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


}
