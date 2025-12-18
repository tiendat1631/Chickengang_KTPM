package com.example.movie.controller;

import com.example.movie.dto.booking.CreateBookingRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;

public class BookingControllerValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void shouldFailValidation_WhenSeatListEmpty() {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setScreeningId(1L);
        request.setTotalPrice(100.0f);
        request.setSeatIds(Collections.emptyList());

        Set<ConstraintViolation<CreateBookingRequest>> violations = validator.validate(request);
        // Expect violations because seatIds should not be empty
        // Note: seatIds has @NotEmpty in original code? Yes.
        assertFalse(violations.isEmpty(), "Expected validation error for empty seat list");
    }

    @Test
    void shouldFailValidation_WhenPriceNegative() {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setScreeningId(1L);
        request.setSeatIds(List.of(1L));
        request.setTotalPrice(-50.0f); // Negative Price

        Set<ConstraintViolation<CreateBookingRequest>> violations = validator.validate(request);

        // BUG VERIFICATION:
        // We expect this assertion to FAIL if the bug exists (missing @Min).
        // If bug exists: violations is empty -> assertFalse(true) -> FAIL.
        assertFalse(violations.isEmpty(),
                "Expected validation error for negative price but got none (Bug Reproduced!)");
    }
}
