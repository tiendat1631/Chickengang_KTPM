package com.example.movie.service.impl;

import com.example.movie.dto.booking.BookingRequest;
import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.dto.booking.PatchBooking;
import com.example.movie.exception.InvalidId;
import com.example.movie.exception.AuthenticationRequiredException;
import com.example.movie.exception.SeatNotFoundException;
import com.example.movie.exception.SeatNotAvailableException;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.mapper.ScreeningMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

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
    public BookingResponse createBooking(CreateBookingRequest createBookingRequest) {
        // Get current user from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationRequiredException("User not authenticated");
        }
        
        // Get username from authentication
        String username = authentication.getName();
        System.out.println("Creating booking for authenticated user: " + username);
        
        // Find user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        // Log the request for debugging
        System.out.println("Creating booking for userId: " + user.getId());
        System.out.println("ScreeningId: " + createBookingRequest.getScreeningId());
        System.out.println("SeatIds: " + createBookingRequest.getSeatIds());
        
        // Validate screening exists
        Screening screening = screeningRepository.findById(createBookingRequest.getScreeningId())
                .orElseThrow(() -> new InvalidId(createBookingRequest.getScreeningId()));

        // Validate seats exist and are available
        List<Seat> seats = seatRepository.findAllById(createBookingRequest.getSeatIds());
        if (seats.size() != createBookingRequest.getSeatIds().size()) {
            throw new SeatNotFoundException("Some seats not found");
        }

        // Check if seats are available for this screening
        for (Seat seat : seats) {
            Ticket existingTicket = ticketRepository.findByScreeningIdAndSeatId(screening.getId(), seat.getId());
            if (existingTicket != null && existingTicket.getStatus() != Ticket.Status.AVAILABLE) {
                throw new SeatNotAvailableException("Seat " + seat.getRowLabel() + seat.getNumber() + " is not available");
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setBookingCode(generateBookingCode());
        booking.setCreatedOn(LocalDateTime.now());
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setTotalPrice(createBookingRequest.getTotalPrice());
        booking.setUser(user);
        booking.setScreening(screening);

        Booking savedBooking = bookingRepository.save(booking);

        // Create or update tickets for each seat
        for (Seat seat : seats) {
            // Check if ticket already exists for this screening + seat
            Ticket existingTicket = ticketRepository.findByScreeningIdAndSeatId(screening.getId(), seat.getId());
            
            if (existingTicket != null) {
                // Ticket already exists - update it
                if (existingTicket.getStatus() != Ticket.Status.AVAILABLE) {
                    throw new SeatNotAvailableException("Seat " + seat.getRowLabel() + seat.getNumber() + " is not available");
                }
                
                // Update existing ticket
                existingTicket.setStatus(Ticket.Status.BOOKED);
                existingTicket.setBooking(savedBooking);
                existingTicket.setMovie(screening.getMovie());
                existingTicket.setAuditorium(screening.getAuditorium());
                // Generate ticketCode if not already set
                if (existingTicket.getTicketCode() == null || existingTicket.getTicketCode().isEmpty()) {
                    existingTicket.setTicketCode(generateTicketCode());
                }
                ticketRepository.save(existingTicket);
            } else {
                // Create new ticket
                Ticket newTicket = new Ticket();
                newTicket.setStatus(Ticket.Status.BOOKED);
                newTicket.setMovie(screening.getMovie());
                newTicket.setAuditorium(screening.getAuditorium());
                newTicket.setScreening(screening);
                newTicket.setSeat(seat);
                newTicket.setBooking(savedBooking);
                // Generate ticketCode when creating ticket
                newTicket.setTicketCode(generateTicketCode());
                ticketRepository.save(newTicket);
            }
        }

        return bookingMapper.toResponse(savedBooking);
    }

    private String generateBookingCode() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = bookingRepository.count() + 1;
        return String.format("BK-%s-%03d", dateStr, count);
    }

    private String generateTicketCode() {
        // Generate unique ticket code (12 characters)
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        
        // Ensure uniqueness by checking against existing tickets
        String ticketCode;
        do {
            code.setLength(0);
            for (int i = 0; i < 12; i++) {
                code.append(chars.charAt(random.nextInt(chars.length())));
            }
            ticketCode = code.toString();
        } while (ticketRepository.existsByTicketCode(ticketCode));
        
        return ticketCode;
    }

    @Override
    public BookingResponse updateBooking(Long id, PatchBooking patchBooking) {
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
        List<Booking> bookings = bookingRepository.findByUserIdWithDetails(userId);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAllWithDetails();
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }

}
