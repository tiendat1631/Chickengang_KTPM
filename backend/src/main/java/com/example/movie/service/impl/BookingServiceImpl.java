package com.example.movie.service.impl;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.PatchBooking;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.mapper.ScreeningMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final ScreeningRepository screeningRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        // Validate user exists
        User user = userRepository.findById(bookingRequest.getUserId())
                .orElseThrow(() -> new InvalidId(bookingRequest.getUserId()));

        // Validate screening exists
        Screening screening = screeningRepository.findById(bookingRequest.getScreeningId())
                .orElseThrow(() -> new InvalidId(bookingRequest.getScreeningId()));

        // Validate seats exist and are available
        List<Seat> seats = seatRepository.findAllById(bookingRequest.getSeatIds());
        if (seats.size() != bookingRequest.getSeatIds().size()) {
            throw new RuntimeException("Some seats not found");
        }

        // Check if seats are available for this screening
        for (Seat seat : seats) {
            Ticket existingTicket = ticketRepository.findByScreeningIdAndSeatId(screening.getId(), seat.getId());
            if (existingTicket != null && existingTicket.getStatus() != Ticket.Status.AVAILABLE) {
                throw new RuntimeException("Seat " + seat.getRowLabel() + seat.getNumber() + " is not available");
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setBookingCode(generateBookingCode());
        booking.setCreatedOn(LocalDateTime.now());
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setTotalPrice(bookingRequest.getTotalPrice());
        booking.setUser(user);
        booking.setScreening(screening);

        Booking savedBooking = bookingRepository.save(booking);

        // Create tickets for each seat
        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setStatus(Ticket.Status.AVAILABLE);
            ticket.setSeat(seat);
            ticket.setScreening(screening);
            ticket.setBooking(savedBooking);
            ticketRepository.save(ticket);
        }

        return bookingMapper.toResponse(savedBooking);
    }

    private String generateBookingCode() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = bookingRepository.count() + 1;
        return String.format("BK-%s-%03d", dateStr, count);
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

    @Override
    public List<BookingResponse> getBookingsByUserId(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedOnDesc(userId);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }

}
