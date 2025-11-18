package com.example.movie.repository;

import com.example.movie.model.Auditorium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriumRepository extends JpaRepository<Auditorium, Long> {
    
    @EntityGraph(attributePaths = {"seats"})
    Page<Auditorium> findAll(Pageable pageable);
}
