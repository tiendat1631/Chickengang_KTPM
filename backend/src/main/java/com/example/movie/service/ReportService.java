package com.example.movie.service;

import com.example.movie.dto.report.DashboardStatsResponse;
import com.example.movie.dto.report.RevenueTrendResponse;
import com.example.movie.dto.report.TopMovieResponse;
import com.example.movie.dto.report.TopUserResponse;

import java.util.List;

public interface ReportService {
    DashboardStatsResponse getDashboardStats();
    RevenueTrendResponse getRevenueTrend(String period);
    List<TopMovieResponse> getTopMovies(int limit);
    List<TopUserResponse> getTopUsers(int limit);
}

