package com.example.movie.controller;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(@Valid @RequestBody PaymentConfirmRequest request) {
        PaymentResponse response = paymentService.confirmPayment(request);
        ApiResponse<PaymentResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                response,
                "Payment confirmed successfully",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PatchMapping("/{paymentId}/complete")
    public ResponseEntity<ApiResponse<PaymentResponse>> completePayment(
            @PathVariable Long paymentId,
            @RequestParam(defaultValue = "SUCCESS") String status) {
        PaymentResponse response = paymentService.completePayment(paymentId, status);
        ApiResponse<PaymentResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                response,
                "Payment completed successfully",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBookingId(@PathVariable Long bookingId) {
        PaymentResponse response = paymentService.getPaymentByBookingId(bookingId);
        ApiResponse<PaymentResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                response,
                "Get payment by booking success",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
