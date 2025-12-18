package com.example.movie.controller;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.dto.booking.PatchBooking;
import com.example.movie.dto.response.ApiResponse;

import com.example.movie.service.BookingService;
import java.util.List;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/bookings")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest createBookingRequest) {
        BookingResponse created = bookingService.createBooking(createBookingRequest);
        ApiResponse<BookingResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "create success",
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable Long id,
            @Valid @RequestBody PatchBooking patchBooking) {
        BookingResponse updated = bookingService.updateBooking(id, patchBooking);
        ApiResponse<BookingResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                updated,
                "update success",
                null);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.OK,
                null,
                "deleted",
                null);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookings(@RequestParam(required = false) Long userId) {
        List<BookingResponse> bookings;
        if (userId != null) {
            bookings = bookingService.getBookingsByUserId(userId);
        } else {
            bookings = bookingService.getAllBookings();
        }
        ApiResponse<List<BookingResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                bookings,
                "get bookings success",
                null);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        BookingResponse cancelled = bookingService.cancelBooking(id);
        ApiResponse<BookingResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                cancelled,
                "booking cancelled",
                null);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
