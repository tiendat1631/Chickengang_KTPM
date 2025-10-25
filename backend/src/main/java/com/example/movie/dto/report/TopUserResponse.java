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
public class TopUserResponse {
    private Long id;
    private String username;
    private String email;
    private BigDecimal totalSpent;
    private Long bookingCount;
}

