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
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final EntityManager entityManager;

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
    @Transactional
    public AuditoriumResponse updateAuditorium(Long id, PatchAuditorium patchAuditorium) {
        Auditorium existingAuditorium = auditoriumRepository.findById(id)
                .orElseThrow(()-> new InvalidId(id));
        
        // Update name if provided
        if (patchAuditorium.getName() != null) {
            existingAuditorium.setName(patchAuditorium.getName());
        }
        
        // Update rows and columns if provided AND different from existing
        // Calculate existing rows and columns
        int existingRows = 0;
        int existingColumns = 0;
        if (existingAuditorium.getSeats() != null && !existingAuditorium.getSeats().isEmpty()) {
            existingRows = (int) existingAuditorium.getSeats().stream()
                .map(Seat::getRowLabel)
                .distinct()
                .count();
            String firstRowLabel = existingAuditorium.getSeats().stream()
                .map(Seat::getRowLabel)
                .min(String::compareTo)
                .orElse("A");
            existingColumns = (int) existingAuditorium.getSeats().stream()
                .filter(s -> s.getRowLabel().equals(firstRowLabel))
                .count();
        }
        
        // Determine new rows and columns
        int newRows = patchAuditorium.getRows() != null ? patchAuditorium.getRows() : existingRows;
        int newColumns = patchAuditorium.getColumns() != null ? patchAuditorium.getColumns() : existingColumns;
        
        // Check if seats configuration actually changed
        boolean shouldUpdateSeats = (patchAuditorium.getRows() != null && patchAuditorium.getRows() != existingRows) ||
                                    (patchAuditorium.getColumns() != null && patchAuditorium.getColumns() != existingColumns);
        
        if (shouldUpdateSeats) {
            // Check if auditorium has any screenings or tickets
            List<com.example.movie.model.Screening> screenings = screeningRepository.findByAuditoriumId(id);
            if (!screenings.isEmpty()) {
                throw new AuditoriumInUseException(
                    "Không thể thay đổi cấu hình ghế. Phòng chiếu đang được sử dụng bởi " +
                    screenings.size() + " suất chiếu. Vui lòng xóa các suất chiếu trước."
                );
            }
            
            long ticketCount = ticketRepository.countByAuditoriumId(id);
            if (ticketCount > 0) {
                throw new AuditoriumInUseException(
                    "Không thể thay đổi cấu hình ghế. Phòng chiếu có " +
                    ticketCount + " vé liên quan. Vui lòng xóa các vé hoặc suất chiếu liên quan trước."
                );
            }
            
            // Delete existing seats using orphanRemoval
            // Must work with the collection directly, not replace it
            if (existingAuditorium.getSeats() != null && !existingAuditorium.getSeats().isEmpty()) {
                // Get all seat IDs before clearing
                List<Long> seatIds = existingAuditorium.getSeats().stream()
                    .map(Seat::getId)
                    .filter(seatId -> seatId != null)
                    .toList();
                
                // Clear the collection - this marks seats for deletion via orphanRemoval
                existingAuditorium.getSeats().clear();
                
                // Save auditorium to trigger orphanRemoval
                auditoriumRepository.save(existingAuditorium);
                
                // Flush to ensure deletion happens in database
                entityManager.flush();
                
                // Explicitly delete seats by ID to ensure they're removed
                // This is a safety measure in case orphanRemoval doesn't work as expected
                if (!seatIds.isEmpty()) {
                    seatRepository.deleteAllById(seatIds);
                    entityManager.flush();
                }
                
                // Clear persistence context to avoid stale references
                entityManager.clear();
                
                // Reload auditorium to get fresh state
                existingAuditorium = auditoriumRepository.findById(id)
                    .orElseThrow(() -> new InvalidId(id));
            }
            
            // Create new seats (must mutate managed collection, not replace it)
            List<Seat> newSeats = new ArrayList<>();
            for (int row = 0; row < newRows; row++) {
                for (int column = 0; column < newColumns; column++) {
                    Seat seat = new Seat();
                    seat.setRowLabel(Character.toString((char)('A') + row));
                    seat.setNumber(column + 1);
                    seat.setSeatType(Seat.SeatType.NORMAL); // Default seat type
                    seat.setAuditorium(existingAuditorium);
                    newSeats.add(seat);
                }
            }
            
            // Reuse the same persistent collection to avoid orphanRemoval errors
            if (existingAuditorium.getSeats() == null) {
                existingAuditorium.setSeats(new ArrayList<>());
            } else {
                existingAuditorium.getSeats().clear();
            }
            existingAuditorium.getSeats().addAll(newSeats);
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
