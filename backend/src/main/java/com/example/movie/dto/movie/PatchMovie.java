package com.example.movie.dto.movie;

import com.example.movie.model.MovieStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatchMovie {
    private String title;
    private String director;
    private String actors;
    private String genres;
    private LocalDate releaseDate;
    private String duration;
    private String language;
    private String rated;
    private String description;
    private MovieStatus status;
}
