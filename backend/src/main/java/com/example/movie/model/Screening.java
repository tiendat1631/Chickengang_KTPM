package com.example.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
// xuất chiếu
public class Screening {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private Format format; // 2D, 3D, IMAX

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auditorium_id", nullable = false)
    private Auditorium auditorium;

    //????
    @OneToMany(mappedBy = "screening")
    private List<Ticket> tickets = new ArrayList<>();

    //????
    @OneToMany(mappedBy = "screening", cascade = CascadeType.ALL)
    private List<Booking> bookings;


    public enum Format{
         IMAX,
        TwoD, // 2D
        ThreeD // 3D
    }

    public enum Status{
        ACTIVE,
        CANCELLED,
        FINISHED
    }
}
