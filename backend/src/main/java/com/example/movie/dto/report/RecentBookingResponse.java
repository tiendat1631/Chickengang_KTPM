package com.example.movie.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentBookingResponse {
    private Long id;
    private String bookingCode;
    private String username;
    private Long screeningId;
    private BigDecimal totalPrice;
    private String bookingStatus;
    private LocalDateTime createdOn;
}

