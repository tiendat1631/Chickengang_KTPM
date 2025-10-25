package com.example.movie.service;

import com.example.movie.dto.user.CreateUserRequest;
import com.example.movie.dto.user.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse createUser(CreateUserRequest user);
    Page<UserResponse> getAllUsers(Pageable pageable, String search);
    UserResponse getUserById(Long id);
    UserResponse updateUserStatus(Long id, boolean isActive);
}
