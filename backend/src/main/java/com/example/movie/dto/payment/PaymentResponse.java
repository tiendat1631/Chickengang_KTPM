package com.example.movie.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Long id;
    private String transactionId;
    private LocalDateTime paymentDate;
    private Float amount;
    private String status;
    private String paymentMethod;
    private String note;
    private Long bookingId;
    private String bookingCode;
}
