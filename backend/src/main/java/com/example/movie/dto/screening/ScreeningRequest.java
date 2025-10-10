package com.example.movie.dto.screening;

import com.example.movie.model.Movie;
import com.example.movie.model.Screening;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;

import java.time.LocalDateTime;

@Data
public class ScreeningRequest {

    @NotNull(message = "Start time cannot be blank")
    @Future(message = "Time have to be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time cannot be blank")
    @Future(message = "Time have to be in the future")
    private LocalDateTime endTime;

    @NotNull(message = "The reference format cannot be blank")
    private Screening.Format format;

    private Screening.Status status = Screening.Status.ACTIVE; // mặc định ACTIVE

    @NotNull(message = "The movie cannot be blank")
    private Long movieId;

    @NotNull(message = "The auditorium cannot be blank")
    private Long auditoriumId;

}
