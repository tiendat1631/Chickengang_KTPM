package com.example.movie.mapper;

import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {
    public PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentDate(payment.getPaymentDate());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus().toString());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setNote(payment.getNote());
        response.setBookingId(payment.getBooking().getId());
        response.setBookingCode(payment.getBooking().getBookingCode());
        return response;
    }
}
