package com.example.movie.service;

import com.example.movie.dto.user.RegisterUserRequest;
import com.example.movie.dto.user.UserResponse;


public interface UserService {
    UserResponse createUser(RegisterUserRequest user);
}
