package com.example.movie.dto.screening;

import com.example.movie.model.Screening;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class PatchScreening {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Screening.Format format;
    private Screening.Status status;
    private Long movieId;
    private String movieTitle;
    private Long auditoriumId;
    private String auditoriumName;
}
