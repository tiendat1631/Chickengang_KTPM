package com.example.movie.dto.booking;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateBookingRequest {
    @NotNull(message = "Screening cannot be null")
    private Long screeningId;

    @NotEmpty(message = "Seat IDs cannot be empty")
    private List<Long> seatIds;

    @NotNull(message = "Total price cannot be null")
    @jakarta.validation.constraints.Min(value = 0, message = "Total price must be positive")
    private Float totalPrice;
}
