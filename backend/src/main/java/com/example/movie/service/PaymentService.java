package com.example.movie.service;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.dto.payment.PaymentUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    PaymentResponse confirmPayment(PaymentConfirmRequest request);
    PaymentResponse completePayment(Long paymentId, String status);
    PaymentResponse updatePendingPayment(Long paymentId, PaymentUpdateRequest request);
    PaymentResponse getPaymentByBookingId(Long bookingId);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
}
