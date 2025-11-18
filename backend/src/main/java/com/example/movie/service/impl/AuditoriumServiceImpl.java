package com.example.movie.service.impl;

import com.example.movie.dto.auditorium.AuditoriumRequest;
import com.example.movie.dto.auditorium.AuditoriumResponse;
import com.example.movie.dto.auditorium.PatchAuditorium;
import com.example.movie.exception.AuditoriumInUseException;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.AuditoriumMapper;
import com.example.movie.model.Auditorium;
import com.example.movie.model.Seat;
import com.example.movie.repository.AuditoriumRepository;
import com.example.movie.repository.ScreeningRepository;
import com.example.movie.repository.SeatRepository;
import com.example.movie.repository.TicketRepository;
import com.example.movie.service.AuditoriumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriumServiceImpl implements AuditoriumService {
    private final AuditoriumRepository auditoriumRepository;
    private final AuditoriumMapper auditoriumMapper;
    private final SeatRepository seatRepository;
    private final ScreeningRepository screeningRepository;
    private final TicketRepository ticketRepository;

    @Override
    public AuditoriumResponse createAuditorium(AuditoriumRequest auditoriumRequest) {
        Auditorium auditorium = auditoriumMapper.toEntity(auditoriumRequest);

        // Create seats and add them to auditorium's seats list
        // Using cascade, saving auditorium will automatically save seats
        List<Seat> seats = new ArrayList<>();
        for (int row = 0 ; row < auditoriumRequest.getRows() ; row++) {
            for (int column = 0 ; column < auditoriumRequest.getColumns() ; column++) {
                Seat seat = new Seat();
                seat.setRowLabel(Character.toString((char)('A') + row));
                seat.setNumber(column+1);
                seat.setSeatType(Seat.SeatType.NORMAL); // Default seat type
                seat.setAuditorium(auditorium);
                seats.add(seat);
            }
        }
        
        // Add seats to auditorium's list (cascade will handle saving)
        auditorium.setSeats(seats);
        
        // Save auditorium - cascade will automatically save all seats
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
        
        // Check if auditorium has any screenings
        List<com.example.movie.model.Screening> screenings = screeningRepository.findByAuditoriumId(id);
        if (!screenings.isEmpty()) {
            throw new AuditoriumInUseException(
                "Không thể xóa phòng chiếu. Phòng chiếu đang được sử dụng bởi " + 
                screenings.size() + " suất chiếu. Vui lòng xóa các suất chiếu trước."
            );
        }
        
        // Check if auditorium has any tickets (direct relationship)
        long ticketCount = ticketRepository.countByAuditoriumId(id);
        if (ticketCount > 0) {
            throw new AuditoriumInUseException(
                "Không thể xóa phòng chiếu. Phòng chiếu đang được sử dụng bởi " + 
                ticketCount + " vé. Vui lòng xóa các vé liên quan trước."
            );
        }
        
        // Seats will be automatically deleted due to cascade = CascadeType.ALL and orphanRemoval = true
        auditoriumRepository.delete(auditorium);
    }

    @Override
    public AuditoriumResponse getAuditorium(Long id) {
        Auditorium auditorium = auditoriumRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        return auditoriumMapper.toResponse(auditorium);
    }

    @Override
    public List<AuditoriumResponse> getAllAuditoriums(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Auditorium> auditoriums = auditoriumRepository.findAll(pageable).getContent();
        return auditoriums.stream()
                .map(auditoriumMapper::toResponse)
                .toList();
    }
}
