package com.example.movie.dto.auditorium;

import com.example.movie.model.Screening;
import com.example.movie.model.Seat;
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
    private String name;
    private List<Seat> seats;
    private  List<Screening> screenings;
}
