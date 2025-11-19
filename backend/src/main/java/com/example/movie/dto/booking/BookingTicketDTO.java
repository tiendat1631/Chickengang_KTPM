package com.example.movie.dto.booking;

import com.example.movie.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingTicketDTO {
    private Long id;
    private String ticketCode;
    private Ticket.Status status;
    private BookingSeatDTO seat;
}

