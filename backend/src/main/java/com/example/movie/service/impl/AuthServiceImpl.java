package com.example.movie.service.impl;

import com.example.movie.dto.auth.AuthResponse;
import com.example.movie.dto.auth.LoginRequest;
import com.example.movie.dto.auth.RegisterRequest;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.exception.EmailAlreadyExistException;
import com.example.movie.exception.InvalidCredentialException;
import com.example.movie.exception.UserNotFoundException;
import com.example.movie.exception.UsernameAlreadyExistException;
import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.security.SecurityUtil;
import com.example.movie.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder  passwordEncoder;
    private final SecurityUtil securityUtil;

    @Override
    @Transactional
    public UserResponse register (RegisterRequest registerRequest) {
        if(userRepository.existsByUsername(registerRequest.getUsername()))
                throw new UsernameAlreadyExistException(registerRequest.getUsername());

        if(userRepository.existsByEmail(registerRequest.getEmail()))
            throw new EmailAlreadyExistException(registerRequest.getEmail());

        User.UserRole role =User.UserRole.CUSTOMER;

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAddress(registerRequest.getAddress());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(role);

        User saved = userRepository.save(user);
        return UserResponse.builder()
                .username(saved.getUsername())
                .email(saved.getEmail())
                .phoneNumber(saved.getPhoneNumber())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
    @Override
    public AuthResponse login (LoginRequest loginRequest) {
        // 1.tìm user theo username
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(()->new UserNotFoundException(loginRequest.getUsername()));

        // 2.kiểm tra password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialException();
        }

        // 3. Sinhtoken
        String accessToken = securityUtil.createAccessToken(user);
        String refreshToken = securityUtil.createRefreshToken(user.getUsername());

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole().name())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        try {
            // Decode refresh token to get username
            Jwt jwt = securityUtil.getJwtDecoder().decode(refreshToken);
            String username = jwt.getSubject();
            
            // Find user by username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Generate new access token
            String newAccessToken = securityUtil.createAccessToken(user);
            
            return AuthResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .phoneNumber(user.getPhoneNumber())
                    .address(user.getAddress())
                    .role(user.getRole().name())
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // Keep the same refresh token
                    .build();
                    
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token");
        }
    }
}
