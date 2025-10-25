package com.example.movie.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopMovieResponse {
    private Long id;
    private String title;
    private BigDecimal revenue;
    private Long bookingCount;
}

