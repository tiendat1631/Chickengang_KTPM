package com.example.movie.dto.auditorium;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuditoriumRequest {

    @NotBlank
    private String name;
    @NotBlank
    private int rows;
    @NotBlank
    private int columns;
}
