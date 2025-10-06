package com.example.movie.Mapper;

import com.example.movie.dto.movie.MovieRequest;
import com.example.movie.dto.movie.MovieResponse;
import com.example.movie.model.Movie;
import org.springframework.stereotype.Component;

@Component
public class MovieMapper {
    public Movie toEntity(MovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setDirector(request.getDirector());
        movie.setActors(request.getActors());
        movie.setGenres(request.getGenres());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDuration(request.getDuration());
        movie.setLanguage(request.getLanguage());
        movie.setRated(request.getRated());
        movie.setDescription(request.getDescription());
        return movie;
    }
    public MovieResponse toResponse(Movie movie) {
        return MovieResponse.builder()
                .title(movie.getTitle())
                .director(movie.getDirector())
                .actors(movie.getActors())
                .genres(movie.getGenres())
                .releaseDate(movie.getReleaseDate())
                .duration(movie.getDuration())
                .language(movie.getLanguage())
                .rated(movie.getRated())
                .description(movie.getDescription())
                .build();
    }
}
