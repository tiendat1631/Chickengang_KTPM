package com.example.movie.mapper;

import com.example.movie.dto.screening.ScreeningRequest;
import com.example.movie.dto.screening.ScreeningResponse;
import com.example.movie.model.Screening;
import org.springframework.stereotype.Component;

@Component
public class ScreeningMapper {
    public Screening toEntity(ScreeningRequest screeningRequest){
        Screening screening = new Screening();
        screening.setStartTime(screeningRequest.getStartTime());
        screening.setEndTime(screeningRequest.getEndTime());
        screening.setFormat(screeningRequest.getFormat());
        screening.setStatus(screeningRequest.getStatus());
        return screening;
    }

    public ScreeningResponse toResponse(Screening screening){
        return ScreeningResponse.builder()
                .id(screening.getId())
                .startTime(screening.getStartTime())
                .endTime(screening.getEndTime())
                .format(screening.getFormat())
                .status(screening.getStatus())
                .movieId(screening.getMovie().getId())
                .movieTitle(screening.getMovie().getTitle())
                .auditoriumId(screening.getAuditorium().getId())
                .auditoriumName(screening.getAuditorium().getName())
                .build();
    }
}
