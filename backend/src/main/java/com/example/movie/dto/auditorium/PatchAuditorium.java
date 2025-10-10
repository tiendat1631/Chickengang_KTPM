package com.example.movie.dto.auditorium;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatchAuditorium {
    private String name;
}
