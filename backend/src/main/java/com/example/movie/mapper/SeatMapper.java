package com.example.movie.mapper;

import com.example.movie.dto.seat.SeatResponse;
import com.example.movie.model.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {
    public SeatResponse toResponse(Seat seat) {
        SeatResponse response = new SeatResponse();
        response.setId(seat.getId());
        response.setRowLabel(seat.getRowLabel());
        response.setNumber(seat.getNumber());
        response.setSeatType(seat.getSeatType().toString());
        response.setAuditoriumId(seat.getAuditorium().getId());
        response.setAuditoriumName(seat.getAuditorium().getName());
        return response;
    }
}
