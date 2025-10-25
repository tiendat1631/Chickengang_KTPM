package com.example.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "auditorium_id", "screening_id", "seat_id"}, name = "uk_movie_auditorium_screening_seat")
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    private Status status;

    @Column(unique = true, length = 14)
    private String ticketCode; // Mã vé duy nhất

    // Quan hệ trực tiếp với Movie
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // Quan hệ trực tiếp với Auditorium
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auditorium_id", nullable = false)
    private Auditorium auditorium;

    // Quan hệ với Screening
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;

    // Quan hệ với Seat
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    // Một vé có thể nằm trong một booking (sau khi đặt)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    public enum Status{
        AVAILABLE,  // Ghế trống
        BOOKED,     // Đã đặt (chưa thanh toán)
        ISSUED,     // Đã phát hành vé (đã thanh toán)
        USED,       // Đã sử dụng
        CANCELLED   // Đã hủy
    }
}
