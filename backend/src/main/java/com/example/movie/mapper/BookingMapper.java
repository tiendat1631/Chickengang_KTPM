package com.example.movie.mapper;

import com.example.movie.dto.booking.*;
import com.example.movie.model.Booking;
import com.example.movie.model.Screening;
import com.example.movie.model.Movie;
import com.example.movie.model.Auditorium;
import com.example.movie.model.Ticket;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingMapper {
    public Booking toEntity(BookingRequest bookingRequest){
        Booking booking = new Booking();
        booking.setTotalPrice(bookingRequest.getTotalPrice());
        // Note: bookingCode, createdOn, and bookingStatus are set in service layer
        return booking;
    }

    public BookingResponse toResponse(Booking booking){
        Screening screening = booking.getScreening();
        Movie movie = screening.getMovie();
        Auditorium auditorium = screening.getAuditorium();
        
        // Map Movie to MovieSummaryDTO
        MovieSummaryDTO movieSummary = MovieSummaryDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .duration(movie.getDuration())
                .rated(movie.getRated())
                .genres(movie.getGenres())
                .build();
        
        // Map Auditorium to AuditoriumSummaryDTO
        AuditoriumSummaryDTO auditoriumSummary = AuditoriumSummaryDTO.builder()
                .id(auditorium.getId())
                .name(auditorium.getName())
                .build();
        
        // Map Screening to BookingScreeningDTO
        BookingScreeningDTO screeningDTO = BookingScreeningDTO.builder()
                .id(screening.getId())
                .startTime(screening.getStartTime())
                .endTime(screening.getEndTime())
                .format(screening.getFormat())
                .status(screening.getStatus())
                .movie(movieSummary)
                .auditorium(auditoriumSummary)
                .build();
        
        // Map Tickets to BookingSeatDTO list (for backward compatibility)
        List<BookingSeatDTO> seats = booking.getTickets() != null 
                ? booking.getTickets().stream()
                    .map(ticket -> BookingSeatDTO.builder()
                            .id(ticket.getSeat().getId())
                            .rowLabel(ticket.getSeat().getRowLabel())
                            .number(ticket.getSeat().getNumber())
                            .seatType(ticket.getSeat().getSeatType().toString())
                            .build())
                    .collect(Collectors.toList())
                : List.of();
        
        // Map Tickets to BookingTicketDTO list (with ticketCode and status)
        List<BookingTicketDTO> tickets = booking.getTickets() != null 
                ? booking.getTickets().stream()
                    .map(ticket -> {
                        BookingSeatDTO seatDTO = ticket.getSeat() != null
                                ? BookingSeatDTO.builder()
                                        .id(ticket.getSeat().getId())
                                        .rowLabel(ticket.getSeat().getRowLabel())
                                        .number(ticket.getSeat().getNumber())
                                        .seatType(ticket.getSeat().getSeatType() != null 
                                                ? ticket.getSeat().getSeatType().toString() 
                                                : "NORMAL")
                                        .build()
                                : null;
                        
                        return BookingTicketDTO.builder()
                                .id(ticket.getId())
                                .ticketCode(ticket.getTicketCode())
                                .status(ticket.getStatus())
                                .seat(seatDTO)
                                .build();
                    })
                    .collect(Collectors.toList())
                : List.of();
        
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .bookingStatus(booking.getBookingStatus())
                .createOn(booking.getCreatedOn())
                .totalPrice(booking.getTotalPrice())
                .username(booking.getUser().getUsername())
                .screening(screeningDTO)
                .seats(seats)
                .tickets(tickets)
                .build();
    }
}
