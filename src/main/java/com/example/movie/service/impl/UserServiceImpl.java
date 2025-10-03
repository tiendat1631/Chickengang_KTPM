package com.example.movie.service.impl;


import com.example.movie.dto.user.RegisterUserRequest;
import com.example.movie.dto.user.UserResponse;

import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    @Override
    public UserResponse createUser (RegisterUserRequest userRequest){
        // Map từ DTO request sang entity
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        user.setAddress(userRequest.getAddress());
        user.setRole(User.UserRole.valueOf("USER")); // set default

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
