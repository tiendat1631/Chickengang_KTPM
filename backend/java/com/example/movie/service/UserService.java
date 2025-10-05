package com.example.movie.service;

import com.example.movie.dto.user.CreateUserRequest;
import com.example.movie.dto.user.UserResponse;


public interface UserService {
    UserResponse createUser(CreateUserRequest user);
}
