package com.example.movie.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserResponse {

    private String email;
    private String phoneNumber;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    //private List<BookingDTO> bookings;
    //private List<PaymentDTO> payments;
}
