package com.example.movie.dto.booking;

import com.example.movie.model.Screening;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingScreeningDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Screening.Format format;
    private Screening.Status status;
    private MovieSummaryDTO movie;
    private AuditoriumSummaryDTO auditorium;
}

