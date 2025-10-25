package com.example.movie.repository;

import com.example.movie.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedOnDesc(Long userId);
    
    @Query("SELECT DISTINCT b FROM Booking b " +
           "LEFT JOIN FETCH b.screening s " +
           "LEFT JOIN FETCH s.movie m " +
           "LEFT JOIN FETCH s.auditorium a " +
           "LEFT JOIN FETCH b.tickets t " +
           "LEFT JOIN FETCH t.seat " +
           "LEFT JOIN FETCH b.user u " +
           "WHERE u.id = :userId " +
           "ORDER BY b.createdOn DESC")
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT b FROM Booking b " +
           "LEFT JOIN FETCH b.screening s " +
           "LEFT JOIN FETCH s.movie m " +
           "LEFT JOIN FETCH s.auditorium a " +
           "LEFT JOIN FETCH b.tickets t " +
           "LEFT JOIN FETCH t.seat " +
           "LEFT JOIN FETCH b.user u")
    List<Booking> findAllWithDetails();
}
