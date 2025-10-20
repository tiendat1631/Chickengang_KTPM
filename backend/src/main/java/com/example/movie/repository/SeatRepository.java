package com.example.movie.repository;

import com.example.movie.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    /**
     * Find all seats by auditorium ID
     */
    List<Seat> findByAuditoriumIdOrderByRowLabelAscNumberAsc(Long auditoriumId);
    
    /**
     * Find all seats by auditorium ID (simplified method)
     */
    List<Seat> findByAuditoriumId(Long auditoriumId);
    
    /**
     * Find a specific seat by auditorium ID, row label, and seat number
     */
    Optional<Seat> findByAuditoriumIdAndRowLabelAndNumber(Long auditoriumId, String rowLabel, Integer number);
    
    /**
     * Find seats by auditorium ID and seat type
     */
    List<Seat> findByAuditoriumIdAndSeatTypeOrderByRowLabelAscNumberAsc(Long auditoriumId, Seat.SeatType seatType);
    
    /**
     * Find available seats for a specific screening (not booked)
     */
    @Query("SELECT s FROM Seat s WHERE s.auditorium.id = :auditoriumId " +
           "AND s.id NOT IN (SELECT t.seat.id FROM Ticket t WHERE t.screening.id = :screeningId " +
           "AND t.status IN (com.example.movie.model.Ticket.Status.SOLD, com.example.movie.model.Ticket.Status.RESERVED)) " +
           "ORDER BY s.rowLabel ASC, s.number ASC")
    List<Seat> findAvailableSeatsForScreening(@Param("auditoriumId") Long auditoriumId, 
                                             @Param("screeningId") Long screeningId);
    
    /**
     * Count total seats in an auditorium
     */
    long countByAuditoriumId(Long auditoriumId);
    
    /**
     * Count seats by type in an auditorium
     */
    long countByAuditoriumIdAndSeatType(Long auditoriumId, Seat.SeatType seatType);
}