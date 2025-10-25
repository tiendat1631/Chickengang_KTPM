package com.example.movie.dto.user;

import com.example.movie.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserResponse {

    private Long id;
    private String email;
    private String phoneNumber;
    private String username;
    private String address;
    private LocalDate dateOfBirth;
    private User.UserRole role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    //private List<BookingDTO> bookings;
    //private List<PaymentDTO> payments;

}
