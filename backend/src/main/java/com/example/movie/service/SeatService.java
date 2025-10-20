package com.example.movie.service;

import com.example.movie.dto.seat.SeatResponse;

import java.util.List;

public interface SeatService {
    List<SeatResponse> getSeatsByScreeningId(Long screeningId);
    List<SeatResponse> getSeatsByAuditoriumId(Long auditoriumId);
}
