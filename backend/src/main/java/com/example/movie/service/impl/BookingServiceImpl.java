package com.example.movie.service.impl;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.PatchBooking;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.mapper.ScreeningMapper;
import com.example.movie.model.Booking;
import com.example.movie.model.Screening;
import com.example.movie.model.User;
import com.example.movie.repository.BookingRepository;
import com.example.movie.repository.ScreeningRepository;
import com.example.movie.repository.UserRepository;
import com.example.movie.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final ScreeningRepository screeningRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        Booking booking = bookingMapper.toEntity(bookingRequest);

        User user = userRepository.findById(bookingRequest.getUserId())
                        .orElseThrow(()->new InvalidId(bookingRequest.getUserId()));

        Screening screening = screeningRepository.findById(bookingRequest.getScreeningId())
                        .orElseThrow(()->new InvalidId(bookingRequest.getScreeningId()));

        booking.setScreening(screening);
        booking.setUser(user);

        bookingRepository.save(booking);
        return bookingMapper.toResponse(booking);
    }

    @Override
    public BookingResponse updateBooking(Long id,PatchBooking patchBooking){
        Booking booking =  bookingRepository.findById(id).orElseThrow(()->new InvalidId(id));

        if (patchBooking.getBookingCode()!=null){
            booking.setBookingCode(patchBooking.getBookingCode());
        }
        if(patchBooking.getBookingStatus()!=null){
            booking.setBookingStatus(patchBooking.getBookingStatus());
        }
        if(patchBooking.getCreateOn()!=null){
            booking.setCreatedOn(patchBooking.getCreateOn());
        }
        if(patchBooking.getTotalPrice() != null ){
            booking.setTotalPrice(patchBooking.getTotalPrice());
        }

        // update username
        if(patchBooking.getScreeningId()!=null){
            User user = userRepository.findById(booking.getUser().getId())
                    .orElseThrow(()->new InvalidId(booking.getUser().getId()));
            booking.setUser(user);
        }


        // update screening
        if (patchBooking.getScreeningId()!=null){
            Screening screening = screeningRepository.findById(booking.getScreening().getId())
                    .orElseThrow(()->new InvalidId(booking.getScreening().getId()));
            booking.setScreening(screening);
        }
        Booking updated = bookingRepository.save(booking);
        return bookingMapper.toResponse(updated);

    }

    @Override
    public void deleteBooking(Long id){
        Booking booking = bookingRepository.findById(id).orElseThrow(()->new InvalidId(id));
        bookingRepository.deleteById(id);
    }

    @Override
    public BookingResponse getBooking(Long id){
        Booking booking = bookingRepository.findById(id).orElseThrow(()->new InvalidId(id));
        return bookingMapper.toResponse(booking);
    }

}
