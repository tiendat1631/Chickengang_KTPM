package com.example.movie.controller;

import com.example.movie.dto.payment.PaymentConfirmRequest;
import com.example.movie.dto.payment.PaymentResponse;
import com.example.movie.service.PaymentService;
import com.example.movie.service.impl.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private JwtDecoder jwtDecoder;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void confirmPayment_ShouldReturnApiResponse() throws Exception {
        PaymentResponse response = new PaymentResponse();
        response.setId(5L);
        given(paymentService.confirmPayment(any(PaymentConfirmRequest.class))).willReturn(response);

        PaymentConfirmRequest request = new PaymentConfirmRequest(1L, "BANK_TRANSFER", "note");

        mockMvc.perform(post("/api/v1/payments/confirm")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Payment confirmed successfully"))
                .andExpect(jsonPath("$.data.id").value(5L));
    }
}

