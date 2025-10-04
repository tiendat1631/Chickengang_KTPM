package com.example.movie.dto.movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieResponse {
    private String title;
    private String director;
    private String actors;
    private String genres;
    private LocalDate releaseDate;
    private String duration;
    private String language;
    private String rated;
    private String description;
}
