package com.example.movie.dto.movie;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
@Data
public class MovieRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String director;

    @NotBlank
    private String actors;

    @NotBlank
    private String genres;

    @NotBlank
    private LocalDate releaseDate;

    @NotBlank
    private String duration;

    @NotBlank
    private String language;

    @NotBlank
    private String rated;

    @NotBlank
    private String description;
}
