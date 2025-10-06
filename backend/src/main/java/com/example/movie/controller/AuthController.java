package com.example.movie.controller;

import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody RegisterRequest registerRequest) {
        UserResponse created = authService.register(registerRequest);
        ApiResponse<UserResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "register successfully",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login (@RequestBody LoginRequest loginRequest) {
        AuthResponse created = authService.login(loginRequest);
        ApiResponse<AuthResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                created,
                "login successfully",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
