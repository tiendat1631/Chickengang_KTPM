package com.example.movie.dto.booking;

import com.example.movie.model.Booking;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    @NotNull(message = "User cannot be null")
    private Long userId;

    @NotNull(message = "Screening cannot be null")
    private Long screeningId;

    @NotEmpty(message = "Seat IDs cannot be empty")
    private List<Long> seatIds;

    @NotNull(message = "Total price cannot be null")
    private Float totalPrice;
}
