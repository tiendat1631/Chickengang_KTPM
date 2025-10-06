package com.example.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    // dãy A, B->Z
    @Column(nullable = false)
    private String rowLabel;

    // số ghế trong 1 dãy
    @Column(nullable = false)
    private int number;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatType seatType;
    public enum SeatType {
        NORMAL,
        SWEETBOX
    }


}
