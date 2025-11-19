package com.example.movie.dto.booking;

import com.example.movie.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class BookingResponse {
    private Long id;
    private String bookingCode;
    private Booking.BookingStatus bookingStatus;
    private LocalDateTime createOn;
    private float totalPrice;
    private String username;
    private BookingScreeningDTO screening;
    private List<BookingSeatDTO> seats;
    private List<BookingTicketDTO> tickets;

}
