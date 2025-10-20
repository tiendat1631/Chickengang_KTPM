package com.example.movie.service;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.PatchBooking;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest booking);
    BookingResponse updateBooking(Long id,PatchBooking patchBooking);
    void  deleteBooking(Long id);
    BookingResponse getBooking(Long id);
    List<BookingResponse> getBookingsByUserId(Long userId);
}
