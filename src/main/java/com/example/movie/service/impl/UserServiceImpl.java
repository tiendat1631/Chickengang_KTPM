package com.example.movie.service.impl;


import com.example.movie.dto.user.CreateUserRequest;
import com.example.movie.dto.user.UserResponse;

import com.example.movie.exception.InvalidRoleException;
import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserResponse createUser (CreateUserRequest userRequest){
        // Map từ DTO request sang entity
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setPhoneNumber(userRequest.getPhoneNumber());
        user.setAddress(userRequest.getAddress());
         // set default
        User.UserRole role;
        try {
            role = userRequest.getRole() == null
                    ? User.UserRole.CUSTOMER
                    : User.UserRole.valueOf(userRequest.getRole());
        }catch (IllegalArgumentException e){
            throw new InvalidRoleException(userRequest.getRole());
        }
        user.setRole(role);
        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .build();
    }
}
