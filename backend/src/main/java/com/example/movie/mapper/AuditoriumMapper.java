package com.example.movie.mapper;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.model.Auditorium;
import org.springframework.stereotype.Component;

@Component
public class AuditoriumMapper {
    public Auditorium toEntity (AuditoriumRequest auditoriumRequest) {
        Auditorium auditorium = new Auditorium();
        auditorium.setName(auditoriumRequest.getName());
        return auditorium;
    }

    public AuditoriumResponse toResponse (Auditorium auditorium) {
        return AuditoriumResponse.builder()
                .name(auditorium.getName())
                .seats(auditorium.getSeats())
                .screenings(auditorium.getScreenings())
                .build();
    }
}
