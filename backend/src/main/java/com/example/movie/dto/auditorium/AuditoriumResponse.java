package com.example.movie.dto.auditorium;

import com.example.movie.dto.seat.SeatResponse;
import com.example.movie.model.Screening;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AuditoriumResponse {
    private Long id;
    private String name;
    private List<SeatResponse> seats;
    private List<Screening> screenings;
}
