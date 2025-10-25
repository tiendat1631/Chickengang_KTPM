package com.example.movie.service.impl;


import com.example.movie.dto.user.CreateUserRequest;
import com.example.movie.dto.user.UserResponse;

import com.example.movie.exception.InvalidRoleException;
import com.example.movie.exception.UserNotFoundException;
import com.example.movie.model.User;
import com.example.movie.repository.UserRepository;
import com.example.movie.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

        return mapToUserResponse(savedUser);
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable, String search) {
        Page<User> users = userRepository.findAllWithSearch(search, pageable);
        return users.map(this::mapToUserResponse);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse updateUserStatus(Long id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        user.setIsActive(isActive);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
