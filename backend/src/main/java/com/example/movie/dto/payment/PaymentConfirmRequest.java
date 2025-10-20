package com.example.movie.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentConfirmRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CASH, BANK_TRANSFER
    
    private String note;
}
