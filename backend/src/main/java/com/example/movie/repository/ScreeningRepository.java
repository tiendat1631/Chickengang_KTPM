package com.example.movie.repository;

import com.example.movie.model.Screening;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningRepository extends JpaRepository<Screening,Long> {

}
