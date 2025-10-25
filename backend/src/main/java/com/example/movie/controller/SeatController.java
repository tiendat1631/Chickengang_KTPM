package com.example.movie.controller;

import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.seat.SeatResponse;
import com.example.movie.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/seats")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SeatController {
    private final SeatService seatService;

    @GetMapping("/screening/{screeningId}")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatsByScreeningId(@PathVariable Long screeningId) {
        List<SeatResponse> seats = seatService.getSeatsByScreeningId(screeningId);
        ApiResponse<List<SeatResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                seats,
                "get seats by screening success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/auditorium/{auditoriumId}")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatsByAuditoriumId(@PathVariable Long auditoriumId) {
        List<SeatResponse> seats = seatService.getSeatsByAuditoriumId(auditoriumId);
        ApiResponse<List<SeatResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                seats,
                "get seats by auditorium success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
