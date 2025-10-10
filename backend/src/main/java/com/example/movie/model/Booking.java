package com.example.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    private String bookingCode;

    @Column(nullable = false)
    private LocalDateTime createdOn;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Column(nullable = false)
    private float totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id", nullable = false)
    private Screening screening;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Ticket> tickets;

    public enum BookingStatus {
        PENDING,    // Đang chờ thanh toán
        CONFIRMED,  // Đã thanh toán / xác nhận
        CANCELLED,  // Đã hủy

    }

}
