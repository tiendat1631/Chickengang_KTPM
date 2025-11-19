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
    @Query("SELECT t FROM Ticket t WHERE t.booking.id = :bookingId")
    List<Ticket> findByBookingId(@Param("bookingId") Long bookingId);
    
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
     * Find ticket by movie, auditorium, screening and seat (using new unique constraint)
     */
    @Query("SELECT t FROM Ticket t WHERE t.movie.id = :movieId AND t.auditorium.id = :auditoriumId AND t.screening.id = :screeningId AND t.seat.id = :seatId")
    Ticket findByMovieIdAndAuditoriumIdAndScreeningIdAndSeatId(@Param("movieId") Long movieId, 
                                                               @Param("auditoriumId") Long auditoriumId,
                                                               @Param("screeningId") Long screeningId, 
                                                               @Param("seatId") Long seatId);
    
    /**
     * Count tickets by status for a screening
     */
    long countByScreeningIdAndStatus(Long screeningId, Ticket.Status status);
    
    /**
     * Find all tickets by auditorium ID
     */
    List<Ticket> findByAuditoriumId(Long auditoriumId);
    
    /**
     * Count tickets by auditorium ID
     */
    long countByAuditoriumId(Long auditoriumId);
    
    /**
     * Check if ticket code exists
     */
    boolean existsByTicketCode(String ticketCode);
}
