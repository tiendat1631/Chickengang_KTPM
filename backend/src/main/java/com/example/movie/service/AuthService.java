package com.example.movie.service;

import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.user.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest authRequest);
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse refreshToken(String refreshToken);
    void logout (String authHeader);
}
