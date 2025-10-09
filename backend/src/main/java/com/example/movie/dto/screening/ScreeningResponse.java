package com.example.movie.dto.screening;

import com.example.movie.model.Screening;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ScreeningResponse {
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
