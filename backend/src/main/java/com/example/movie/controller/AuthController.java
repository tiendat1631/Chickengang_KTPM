package com.example.movie.controller;

import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.auth.RefreshTokenRequest;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse created = authService.register(registerRequest);
        ApiResponse<UserResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "register successfully",
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse created = authService.login(loginRequest);
        ApiResponse<AuthResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                created,
                "login successfully",
                null);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody RefreshTokenRequest refreshTokenRequest) {
        AuthResponse response = authService.refreshToken(refreshTokenRequest.getRefreshToken());
        ApiResponse<AuthResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                response,
                "Token refreshed successfully",
                null);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
