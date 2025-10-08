package com.example.movie.service.impl;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.dto.auditorium.PatchAuditorium;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.AuditoriumMapper;
import com.example.movie.model.Auditorium;
import com.example.movie.model.Seat;
import com.example.movie.repository.AuditoriumRepository;
import com.example.movie.repository.SeatRepository;
import com.example.movie.service.AuditoriumService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriumServiceImpl implements AuditoriumService {
    private final AuditoriumRepository auditoriumRepository;
    private final AuditoriumMapper auditoriumMapper;
    private final SeatRepository seatRepository;

    @Override
    public AuditoriumResponse createAuditorium(AuditoriumRequest auditoriumRequest) {
        Auditorium auditorium = auditoriumMapper.toEntity(auditoriumRequest);
       // auditoriumRepository.save(auditorium);

        List<Seat> seats = new ArrayList<>();
        for (int row = 0 ; row < auditoriumRequest.getRows() ; row++) {
            for (int column = 0 ; column < auditoriumRequest.getColumns() ; column++) {
                Seat seat = new Seat();
                seat.setRowLabel(Character.toString((char)('A') + row));
                seat.setNumber(column+1);
                seat.setAuditorium(auditorium);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
        Auditorium saved = auditoriumRepository.save(auditorium);
        return auditoriumMapper.toResponse(saved);
    }

    @Override
    public AuditoriumResponse updateAuditorium(Long id, PatchAuditorium patchAuditorium) {
        Auditorium existingAuditorium = auditoriumRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        if (patchAuditorium.getName() != null) {
            existingAuditorium.setName(patchAuditorium.getName());
        }
        Auditorium saved = auditoriumRepository.save(existingAuditorium);
        return auditoriumMapper.toResponse(saved);
    }

    @Override
    public void deleteAuditorium(Long id) {
        Auditorium auditorium = auditoriumRepository.findById(id)
                        .orElseThrow(()-> new InvalidId(id));
        auditoriumRepository.delete(auditorium);
    }

    @Override
    public AuditoriumResponse getAuditorium(Long id) {
        Auditorium auditorium = auditoriumRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        return auditoriumMapper.toResponse(auditorium);
    }
}
