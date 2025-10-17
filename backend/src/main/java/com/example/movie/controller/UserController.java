package com.example.movie.controller;

import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.user.CreateUserRequest;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.service.UserService;
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
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {
    private final UserService userService;


    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> register (@Valid @RequestBody CreateUserRequest userRequest) {
        UserResponse created = userService.createUser(userRequest);
        ApiResponse<UserResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                created,
                "create successfully",
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
