package com.example.movie.controller;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.PatchBooking;
import com.example.movie.dto.response.ApiResponse;

import com.example.movie.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/bookings")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest bookingRequest){
        BookingResponse created = bookingService.createBooking(bookingRequest);
        ApiResponse<BookingResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "create success",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
    @PatchMapping
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable Long id,@Valid @RequestBody PatchBooking patchBooking){
        BookingResponse updated = bookingService.updateBooking(id, patchBooking);
        ApiResponse<BookingResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                updated,
                "update success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id){
        bookingService.deleteBooking(id);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.OK,
                null,
                "deleted",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<BookingResponse>> getBookings(@RequestParam Long id){
        BookingResponse booking = bookingService.getBooking(id);
        ApiResponse<BookingResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                booking,
                "get booking success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
