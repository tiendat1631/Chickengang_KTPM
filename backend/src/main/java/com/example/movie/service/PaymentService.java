package com.example.movie.service;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;

public interface PaymentService {
    PaymentResponse confirmPayment(PaymentConfirmRequest request);
    PaymentResponse completePayment(Long paymentId, String status);
    PaymentResponse getPaymentByBookingId(Long bookingId);
}
