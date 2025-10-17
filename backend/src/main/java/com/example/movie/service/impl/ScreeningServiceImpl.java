package com.example.movie.service.impl;

import com.example.movie.dto.screening.PatchScreening;
import com.example.movie.dto.screening.ScreeningRequest;
import com.example.movie.dto.screening.ScreeningResponse;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.ScreeningMapper;
import com.example.movie.model.*;
import com.example.movie.repository.AuditoriumRepository;
import com.example.movie.repository.MovieRepository;
import com.example.movie.repository.ScreeningRepository;
import com.example.movie.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScreeningServiceImpl implements ScreeningService {
    private final ScreeningRepository screeningRepository;
    private final ScreeningMapper screeningMapper;
    private final AuditoriumRepository auditoriumRepository;
    private final MovieRepository movieRepository;

    @Override
    public ScreeningResponse createScreening (ScreeningRequest screeningRequest) {

        //Convert request -> entity
        Screening screening = screeningMapper.toEntity(screeningRequest);

        //Kiểm tra auditorium tồn tại
        Auditorium auditorium = auditoriumRepository.findById(screeningRequest.getAuditoriumId())
                .orElseThrow(()-> new InvalidId(screeningRequest.getAuditoriumId()));

        // kiểm tra movie tồn tại
        Movie movie = movieRepository.findById(screeningRequest.getMovieId())
                .orElseThrow(()-> new InvalidId(screeningRequest.getMovieId()));

        screening.setMovie(movie);
        screening.setAuditorium(auditorium);
        // tao danh sach ticket tuong ung trong voi cac ghe
        List<Ticket> tickets = new ArrayList<>();
        for (Seat seat : auditorium.getSeats()) {
            Ticket ticket = new Ticket();
            ticket.setSeat(seat);
            ticket.setScreening(screening);
            ticket.setStatus(Ticket.Status.AVAILABLE);
            tickets.add(ticket);
        }
        screening.setTickets(tickets);

        Screening saved = screeningRepository.save(screening);
        return screeningMapper.toResponse(saved);
    }

    @Override
    public ScreeningResponse updateScreening (Long id, PatchScreening  patchScreening) {
        // check screening hien tai co ton tai khong
        Screening existingScreening = screeningRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        if(patchScreening.getId() != null){
            existingScreening.setId(patchScreening.getId());
        }
        if (patchScreening.getStartTime() != null){
            existingScreening.setStartTime(patchScreening.getStartTime());
        }
        if (patchScreening.getEndTime() != null){
            existingScreening.setEndTime(patchScreening.getEndTime());
        }
        if (patchScreening.getFormat() != null){
            existingScreening.setFormat(patchScreening.getFormat());
        }
        if(patchScreening.getStatus()!= null){
            existingScreening.setStatus(patchScreening.getStatus());
        }

        // cập nhật phim
        if(patchScreening.getMovieId() != null){
            Movie movie = movieRepository.findById(patchScreening.getMovieId())
                    .orElseThrow(()-> new InvalidId(patchScreening.getMovieId()));
            existingScreening.setMovie(movie);
        }
        // cập nhật phòng
        if(patchScreening.getAuditoriumId() != null){
            Auditorium auditorium = auditoriumRepository.findById(patchScreening.getAuditoriumId())
                    .orElseThrow(()-> new InvalidId(patchScreening.getAuditoriumId()));
            existingScreening.setAuditorium(auditorium);
        }
        Screening updated =  screeningRepository.save(existingScreening);
        return screeningMapper.toResponse(updated);
    }

    @Override
    public void deleteScreening(Long id){
        Screening existingScreening = screeningRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        screeningRepository.delete(existingScreening);
    }

    @Override
    public ScreeningResponse getScreening(Long id) {
        Screening existingScreening = screeningRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        return screeningMapper.toResponse(existingScreening);
    }

    @Override
    public List<ScreeningResponse> getScreeningsByMovieId(Long movieId) {
        List<Screening> screenings = screeningRepository.findByMovieIdAndStatusActive(movieId);
        return screenings.stream()
                .map(screeningMapper::toResponse)
                .toList();
    }
}
