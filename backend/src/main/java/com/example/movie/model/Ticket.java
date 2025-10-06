package com.example.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    private Status status;

    @OneToOne
    @JoinColumn(name = "seat_id", nullable = false, unique = true)
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;

    // Một vé có thể nằm trong một booking (sau khi đặt)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking; // thêm dòng này để biết vé nào thuộc booking nào

    public enum Status{
        AVAILABLE,
        SOLD,
        RESERVED

    }
}
