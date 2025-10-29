package com.example.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String director;

    @Column(nullable = false)
    private String actors;

    @Column(nullable = false)
    private String genres;

    @Column(nullable = false)
    private LocalDate releaseDate;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String rated;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column
    private MovieStatus status;
}
