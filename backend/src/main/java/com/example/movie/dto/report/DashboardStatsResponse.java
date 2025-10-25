package com.example.movie.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalMovies;
    private Long totalBookings;
    private BigDecimal totalRevenue;
    private BigDecimal averageBookingValue;
    private List<RecentBookingResponse> recentBookings;
    private List<TopMovieResponse> topMovies;
}

