package com.example.movie.dto.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentUpdateRequest {
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String note;
}

