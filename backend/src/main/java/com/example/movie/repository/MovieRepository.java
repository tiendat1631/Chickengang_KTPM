package com.example.movie.repository;

import com.example.movie.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MovieRepository extends JpaRepository<Movie, Long> {

}
