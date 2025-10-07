package com.example.movie.repository;

import com.example.movie.model.Auditorium;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriumRepository extends JpaRepository<Auditorium, Long> {
}
