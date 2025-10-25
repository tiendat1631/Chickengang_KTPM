package com.example.movie.service.impl;

import com.example.movie.dto.report.*;
import com.example.movie.model.Booking;
import com.example.movie.model.Movie;
import com.example.movie.model.User;
import com.example.movie.repository.BookingRepository;
import com.example.movie.repository.MovieRepository;
import com.example.movie.repository.UserRepository;
import com.example.movie.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final BookingRepository bookingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        // Get basic counts
        long totalUsers = userRepository.count();
        long totalMovies = movieRepository.count();
        long totalBookings = bookingRepository.count();
        
        // Calculate total revenue - only count PAID bookings
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .filter(booking -> booking.getBookingStatus() == Booking.BookingStatus.PAID)
                .map(booking -> BigDecimal.valueOf(booking.getTotalPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate average booking value
        BigDecimal averageBookingValue = totalBookings > 0 ? 
                totalRevenue.divide(BigDecimal.valueOf(totalBookings), 2, BigDecimal.ROUND_HALF_UP) : 
                BigDecimal.ZERO;
        
        // Get recent bookings (last 5)
        List<RecentBookingResponse> recentBookings = bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedOn().compareTo(a.getCreatedOn()))
                .limit(5)
                .map(this::mapToRecentBookingResponse)
                .collect(Collectors.toList());
        
        // Get top movies - calculate real revenue from PAID bookings
        Map<Long, MovieStats> movieStatsMap = new HashMap<>();
        
        bookingRepository.findAll().stream()
                .filter(booking -> booking.getBookingStatus() == Booking.BookingStatus.PAID)
                .forEach(booking -> {
                    Movie movie = booking.getScreening().getMovie();
                    MovieStats stats = movieStatsMap.computeIfAbsent(movie.getId(), k -> new MovieStats());
                    stats.movie = movie;
                    stats.revenue = stats.revenue.add(BigDecimal.valueOf(booking.getTotalPrice()));
                    stats.bookingCount++;
                });
        
        List<TopMovieResponse> topMovies = movieStatsMap.values().stream()
                .sorted((a, b) -> b.revenue.compareTo(a.revenue))
                .limit(5)
                .map(stats -> TopMovieResponse.builder()
                        .id(stats.movie.getId())
                        .title(stats.movie.getTitle())
                        .revenue(stats.revenue)
                        .bookingCount(stats.bookingCount)
                        .build())
                .collect(Collectors.toList());
        
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalMovies(totalMovies)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .averageBookingValue(averageBookingValue)
                .recentBookings(recentBookings)
                .topMovies(topMovies)
                .build();
    }

    @Override
    public RevenueTrendResponse getRevenueTrend(String period) {
        List<Booking> allBookings = bookingRepository.findAll();
        List<RevenueTrendResponse.RevenueDataPoint> dataPoints = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        
        if ("day".equals(period)) {
            // Hourly data for today
            for (int i = 0; i < 24; i++) {
                LocalDateTime hourStart = now.withHour(i).withMinute(0).withSecond(0);
                LocalDateTime hourEnd = hourStart.plusHours(1);
                
                BigDecimal hourRevenue = allBookings.stream()
                        .filter(booking -> {
                            LocalDateTime bookingTime = booking.getCreatedOn();
                            return bookingTime.isAfter(hourStart) && bookingTime.isBefore(hourEnd)
                                    && booking.getBookingStatus() == Booking.BookingStatus.PAID;
                        })
                        .map(booking -> BigDecimal.valueOf(booking.getTotalPrice()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                long hourBookings = allBookings.stream()
                        .filter(booking -> {
                            LocalDateTime bookingTime = booking.getCreatedOn();
                            return bookingTime.isAfter(hourStart) && bookingTime.isBefore(hourEnd);
                        })
                        .count();
                
                dataPoints.add(RevenueTrendResponse.RevenueDataPoint.builder()
                        .time(String.format("%02d:00", i))
                        .revenue(hourRevenue)
                        .bookings(hourBookings)
                        .build());
            }
        } else if ("week".equals(period)) {
            // Daily data for last 7 days
            for (int i = 6; i >= 0; i--) {
                LocalDateTime dayStart = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
                LocalDateTime dayEnd = dayStart.plusDays(1);
                
                BigDecimal dayRevenue = allBookings.stream()
                        .filter(booking -> {
                            LocalDateTime bookingTime = booking.getCreatedOn();
                            return bookingTime.isAfter(dayStart) && bookingTime.isBefore(dayEnd)
                                    && booking.getBookingStatus() == Booking.BookingStatus.PAID;
                        })
                        .map(booking -> BigDecimal.valueOf(booking.getTotalPrice()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                long dayBookings = allBookings.stream()
                        .filter(booking -> {
                            LocalDateTime bookingTime = booking.getCreatedOn();
                            return bookingTime.isAfter(dayStart) && bookingTime.isBefore(dayEnd);
                        })
                        .count();
                
                dataPoints.add(RevenueTrendResponse.RevenueDataPoint.builder()
                        .time(dayStart.format(DateTimeFormatter.ofPattern("EEE", Locale.forLanguageTag("vi-VN"))))
                        .revenue(dayRevenue)
                        .bookings(dayBookings)
                        .build());
            }
        } else if ("month".equals(period)) {
            // Weekly data for current month
            LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            int weeks = (int) Math.ceil((now.toLocalDate().toEpochDay() - monthStart.toLocalDate().toEpochDay()) / 7.0);
            
            for (int i = 0; i < weeks; i++) {
                LocalDateTime weekStart = monthStart.plusWeeks(i);
                LocalDateTime weekEnd = weekStart.plusWeeks(1);
                
                BigDecimal weekRevenue = allBookings.stream()
                        .filter(booking -> {
                            LocalDateTime bookingTime = booking.getCreatedOn();
                            return bookingTime.isAfter(weekStart) && bookingTime.isBefore(weekEnd)
                                    && booking.getBookingStatus() == Booking.BookingStatus.PAID;
                        })
                        .map(booking -> BigDecimal.valueOf(booking.getTotalPrice()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                long weekBookings = allBookings.stream()
                        .filter(booking -> {
                            LocalDateTime bookingTime = booking.getCreatedOn();
                            return bookingTime.isAfter(weekStart) && bookingTime.isBefore(weekEnd);
                        })
                        .count();
                
                dataPoints.add(RevenueTrendResponse.RevenueDataPoint.builder()
                        .time("Tuần " + (i + 1))
                        .revenue(weekRevenue)
                        .bookings(weekBookings)
                        .build());
            }
        }
        
        return RevenueTrendResponse.builder()
                .dataPoints(dataPoints)
                .build();
    }

    @Override
    public List<TopMovieResponse> getTopMovies(int limit) {
        // Calculate real revenue from PAID bookings
        Map<Long, MovieStats> movieStatsMap = new HashMap<>();
        
        bookingRepository.findAll().stream()
                .filter(booking -> booking.getBookingStatus() == Booking.BookingStatus.PAID)
                .forEach(booking -> {
                    Movie movie = booking.getScreening().getMovie();
                    MovieStats stats = movieStatsMap.computeIfAbsent(movie.getId(), k -> new MovieStats());
                    stats.movie = movie;
                    stats.revenue = stats.revenue.add(BigDecimal.valueOf(booking.getTotalPrice()));
                    stats.bookingCount++;
                });
        
        return movieStatsMap.values().stream()
                .sorted((a, b) -> b.revenue.compareTo(a.revenue))
                .limit(limit)
                .map(stats -> TopMovieResponse.builder()
                        .id(stats.movie.getId())
                        .title(stats.movie.getTitle())
                        .revenue(stats.revenue)
                        .bookingCount(stats.bookingCount)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<TopUserResponse> getTopUsers(int limit) {
        Map<String, UserStats> userStats = new HashMap<>();
        
        // Only count PAID bookings for user stats
        bookingRepository.findAll().stream()
                .filter(booking -> booking.getBookingStatus() == Booking.BookingStatus.PAID)
                .forEach(booking -> {
                    String username = booking.getUser().getUsername();
                    UserStats stats = userStats.computeIfAbsent(username, k -> new UserStats());
                    stats.totalSpent = stats.totalSpent.add(BigDecimal.valueOf(booking.getTotalPrice()));
                    stats.bookingCount++;
                    stats.user = booking.getUser();
                });
        
        return userStats.values().stream()
                .sorted((a, b) -> b.totalSpent.compareTo(a.totalSpent))
                .limit(limit)
                .map(stats -> TopUserResponse.builder()
                        .id(stats.user.getId())
                        .username(stats.user.getUsername())
                        .email(stats.user.getEmail())
                        .totalSpent(stats.totalSpent)
                        .bookingCount(stats.bookingCount)
                        .build())
                .collect(Collectors.toList());
    }
    
    private RecentBookingResponse mapToRecentBookingResponse(Booking booking) {
        return RecentBookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .username(booking.getUser().getUsername())
                .screeningId(booking.getScreening().getId())
                .totalPrice(BigDecimal.valueOf(booking.getTotalPrice()))
                .bookingStatus(booking.getBookingStatus().toString())
                .createdOn(booking.getCreatedOn())
                .build();
    }
    
    private static class UserStats {
        BigDecimal totalSpent = BigDecimal.ZERO;
        long bookingCount = 0;
        User user;
    }
    
    private static class MovieStats {
        BigDecimal revenue = BigDecimal.ZERO;
        long bookingCount = 0;
        Movie movie;
    }
}
