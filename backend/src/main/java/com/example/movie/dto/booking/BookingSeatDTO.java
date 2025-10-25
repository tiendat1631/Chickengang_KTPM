package com.example.movie.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSeatDTO {
    private Long id;
    private String rowLabel;
    private int number;
    private String seatType;
}

