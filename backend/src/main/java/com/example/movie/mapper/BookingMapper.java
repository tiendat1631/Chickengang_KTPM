package com.example.movie.mapper;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    public Booking toEntity(BookingRequest bookingRequest){
        Booking booking = new Booking();
        booking.setBookingCode(bookingRequest.getBookingCode());
        booking.setCreatedOn(bookingRequest.getCreateOn());
        booking.setBookingStatus(bookingRequest.getBookingStatus());
        booking.setTotalPrice(bookingRequest.getTotalPrice());
        return booking;
    }

    public BookingResponse toResponse(Booking booking){
        return BookingResponse.builder()
                .bookingCode(booking.getBookingCode())
                .bookingStatus(booking.getBookingStatus())
                .createOn(booking.getCreatedOn())
                .totalPrice(booking.getTotalPrice())
                .username(booking.getUser().getUsername())
                .screeningId(booking.getScreening().getId())
                .build();
    }
}
