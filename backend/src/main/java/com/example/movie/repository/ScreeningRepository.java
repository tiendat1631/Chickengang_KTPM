package com.example.movie.repository;

import com.example.movie.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScreeningRepository extends JpaRepository<Screening,Long> {
    
    @Query("SELECT s FROM Screening s WHERE s.movie.id = :movieId AND s.status = 'ACTIVE' ORDER BY s.startTime")
    List<Screening> findByMovieIdAndStatusActive(@Param("movieId") Long movieId);
    
    List<Screening> findByMovieIdOrderByStartTime(Long movieId);
    
    /**
     * Find all screenings by auditorium ID
     */
    List<Screening> findByAuditoriumId(Long auditoriumId);
}
