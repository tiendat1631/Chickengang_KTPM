package com.example.movie.repository;

import com.example.movie.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    /**
     * Find all tickets for a specific screening
     */
    List<Ticket> findByScreeningId(Long screeningId);
    
    /**
     * Find tickets by booking ID
     */
    List<Ticket> findByBookingId(Long bookingId);
    
    /**
     * Find tickets by seat ID
     */
    List<Ticket> findBySeatId(Long seatId);
    
    /**
     * Find auditorium ID by screening ID
     */
    @Query("SELECT s.auditorium.id FROM Screening s WHERE s.id = :screeningId")
    Long findAuditoriumIdByScreeningId(@Param("screeningId") Long screeningId);
    
    /**
     * Find tickets by screening and seat
     */
    @Query("SELECT t FROM Ticket t WHERE t.screening.id = :screeningId AND t.seat.id = :seatId")
    Ticket findByScreeningIdAndSeatId(@Param("screeningId") Long screeningId, @Param("seatId") Long seatId);
    
    /**
     * Count tickets by status for a screening
     */
    long countByScreeningIdAndStatus(Long screeningId, Ticket.Status status);
}
