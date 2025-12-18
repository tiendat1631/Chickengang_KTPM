package com.example.movie.controller;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.dto.payment.PaymentUpdateRequest;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

        @PostMapping("/confirm")
        @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(
                        @Valid @RequestBody PaymentConfirmRequest request) {
                PaymentResponse response = paymentService.confirmPayment(request);

                // Notify frontend
                messagingTemplate.convertAndSend("/topic/booking/" + response.getBookingId() + "/payment", response);
                messagingTemplate.convertAndSend("/topic/payments", response);

                ApiResponse<PaymentResponse> result = new ApiResponse<>(
                                HttpStatus.OK,
                                response,
                                "Payment confirmed successfully",
                                null);
                return ResponseEntity.status(HttpStatus.OK).body(result);
        }

        @PreAuthorize("hasRole('ADMIN')")
        @PatchMapping("/{paymentId}/complete")
        public ResponseEntity<ApiResponse<PaymentResponse>> completePayment(
                        @PathVariable Long paymentId,
                        @RequestParam(defaultValue = "SUCCESS") String status) {
                PaymentResponse response = paymentService.completePayment(paymentId, status);

                // Notify frontend
                messagingTemplate.convertAndSend("/topic/booking/" + response.getBookingId() + "/payment", response);
                messagingTemplate.convertAndSend("/topic/payments", response);

                ApiResponse<PaymentResponse> result = new ApiResponse<>(
                                HttpStatus.OK,
                                response,
                                "Payment completed successfully",
                                null);
                return ResponseEntity.status(HttpStatus.OK).body(result);
        }

        @PatchMapping("/{paymentId}")
        @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
        public ResponseEntity<ApiResponse<PaymentResponse>> updatePendingPayment(
                        @PathVariable Long paymentId,
                        @Valid @RequestBody PaymentUpdateRequest request) {
                PaymentResponse response = paymentService.updatePendingPayment(paymentId, request);
                ApiResponse<PaymentResponse> result = new ApiResponse<>(
                                HttpStatus.OK,
                                response,
                                "Payment updated successfully",
                                null);
                return ResponseEntity.status(HttpStatus.OK).body(result);
        }

        @GetMapping("/booking/{bookingId}")
        public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBookingId(@PathVariable Long bookingId) {
                PaymentResponse response = paymentService.getPaymentByBookingId(bookingId);
                ApiResponse<PaymentResponse> result = new ApiResponse<>(
                                HttpStatus.OK,
                                response,
                                "Get payment by booking success",
                                null);
                return ResponseEntity.status(HttpStatus.OK).body(result);
        }

        @PreAuthorize("hasRole('ADMIN')")
        @GetMapping
        public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getAllPayments(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "id,DESC") String sort) {

                String[] sortParams = sort.split(",");
                Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("ASC")
                                ? Sort.Direction.ASC
                                : Sort.Direction.DESC;
                Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

                Page<PaymentResponse> payments = paymentService.getAllPayments(pageable);
                ApiResponse<Page<PaymentResponse>> result = new ApiResponse<>(
                                HttpStatus.OK,
                                payments,
                                "Get all payments success",
                                null);
                return ResponseEntity.status(HttpStatus.OK).body(result);
        }
}
