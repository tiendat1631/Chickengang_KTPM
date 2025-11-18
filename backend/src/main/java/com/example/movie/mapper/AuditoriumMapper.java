package com.example.movie.mapper;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.dto.seat.SeatResponse;
import com.example.movie.model.Auditorium;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuditoriumMapper {
    private final SeatMapper seatMapper;
    
    public AuditoriumMapper(SeatMapper seatMapper) {
        this.seatMapper = seatMapper;
    }
    
    public Auditorium toEntity (AuditoriumRequest auditoriumRequest) {
        Auditorium auditorium = new Auditorium();
        auditorium.setName(auditoriumRequest.getName());
        return auditorium;
    }

    public AuditoriumResponse toResponse (Auditorium auditorium) {
        List<SeatResponse> seatResponses = null;
        if (auditorium.getSeats() != null) {
            seatResponses = auditorium.getSeats().stream()
                    .map(seatMapper::toResponse)
                    .collect(Collectors.toList());
        }
        
        return AuditoriumResponse.builder()
                .id(auditorium.getId())
                .name(auditorium.getName())
                .seats(seatResponses)
                .screenings(null) // Exclude screenings to avoid Hibernate proxy serialization issues
                .build();
    }
}
