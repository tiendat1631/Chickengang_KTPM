package com.example.movie.controller;

import com.example.movie.dto.report.DashboardStatsResponse;
import com.example.movie.dto.report.RevenueTrendResponse;
import com.example.movie.dto.report.TopMovieResponse;
import com.example.movie.dto.report.TopUserResponse;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = reportService.getDashboardStats();
        ApiResponse<DashboardStatsResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                stats,
                "Dashboard stats retrieved successfully",
                null
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue-trend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RevenueTrendResponse>> getRevenueTrend(
            @RequestParam(defaultValue = "week") String period) {
        RevenueTrendResponse trend = reportService.getRevenueTrend(period);
        ApiResponse<RevenueTrendResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                trend,
                "Revenue trend retrieved successfully",
                null
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/top-movies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TopMovieResponse>>> getTopMovies(
            @RequestParam(defaultValue = "5") int limit) {
        List<TopMovieResponse> topMovies = reportService.getTopMovies(limit);
        ApiResponse<List<TopMovieResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                topMovies,
                "Top movies retrieved successfully",
                null
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/top-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TopUserResponse>>> getTopUsers(
            @RequestParam(defaultValue = "5") int limit) {
        List<TopUserResponse> topUsers = reportService.getTopUsers(limit);
        ApiResponse<List<TopUserResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                topUsers,
                "Top users retrieved successfully",
                null
        );
        return ResponseEntity.ok(result);
    }
}

