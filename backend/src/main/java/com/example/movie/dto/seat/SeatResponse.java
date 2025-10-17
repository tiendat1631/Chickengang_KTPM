package com.example.movie.dto.seat;

import com.example.movie.model.Seat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    private Long id;
    private String rowLabel;
    private Integer number;
    private Seat.SeatType seatType;
    private Long auditoriumId;
    private String auditoriumName;
}
