package com.example.movie.service.impl;

import com.example.movie.dto.seat.SeatResponse;
import com.example.movie.mapper.SeatMapper;
import com.example.movie.model.Seat;
import com.example.movie.model.Ticket;
import com.example.movie.repository.SeatRepository;
import com.example.movie.repository.TicketRepository;
import com.example.movie.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final SeatMapper seatMapper;

    @Override
    public List<SeatResponse> getSeatsByScreeningId(Long screeningId) {
        // Get all seats for the auditorium of this screening
        List<Seat> seats = seatRepository.findByAuditoriumId(
            ticketRepository.findAuditoriumIdByScreeningId(screeningId)
        );
        
        // Get ticket statuses for this screening
        List<Ticket> tickets = ticketRepository.findByScreeningId(screeningId);
        
        return seats.stream().map(seat -> {
            SeatResponse response = seatMapper.toResponse(seat);
            
            // Find ticket for this seat in this screening
            Ticket ticket = tickets.stream()
                .filter(t -> t.getSeat().getId().equals(seat.getId()))
                .findFirst()
                .orElse(null);
            
            if (ticket != null) {
                response.setStatus(ticket.getStatus().toString());
            } else {
                response.setStatus("AVAILABLE");
            }
            
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public List<SeatResponse> getSeatsByAuditoriumId(Long auditoriumId) {
        List<Seat> seats = seatRepository.findByAuditoriumId(auditoriumId);
        return seats.stream()
            .map(seatMapper::toResponse)
            .collect(Collectors.toList());
    }
}
