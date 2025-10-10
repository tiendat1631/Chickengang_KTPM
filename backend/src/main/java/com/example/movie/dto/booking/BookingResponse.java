package com.example.movie.dto.booking;

import com.example.movie.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class BookingResponse {
    private String bookingCode;
    private Booking.BookingStatus bookingStatus;
    private LocalDateTime createOn;
    private float totalPrice;
    private String username;
    private Long screeningId;

}
