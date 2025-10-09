package com.example.movie.dto.booking;

import com.example.movie.model.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class PatchBooking {
    private String bookingCode;
    private Booking.BookingStatus bookingStatus;
    private LocalDateTime createOn;
    private Float totalPrice;
    private String username;
    private Long screeningId;
}
