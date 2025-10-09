package com.example.movie.dto.booking;


import com.example.movie.model.Booking;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class BookingRequest {
    @NotBlank(message = "bookingCode is not booking code")
    private String bookingCode;

    @NotNull(message = "booking time cannot be blank")
    @Future(message = "Time have to be in the future")
    private LocalDateTime createOn;

    @NotNull(message = "booking status cannot be blank")
    private Booking.BookingStatus bookingStatus;

    private float totalPrice;

    @NotNull(message = "User cannot be null")
    private Long userId;

    @NotNull(message = "Screening cannot be null")
    private Long screeningId;


}
