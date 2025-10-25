package com.example.movie.dto.seat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatResponse {
    private Long id;
    private String rowLabel;
    private int number;
    private String seatType;
    private String status;
    private Long auditoriumId;
    private String auditoriumName;
}