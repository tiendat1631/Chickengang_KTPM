package com.example.movie.controller;

import com.example.movie.dto.response.ApiResponse;
import com.example.movie.dto.user.CreateUserRequest;
import com.example.movie.dto.user.UserResponse;
import com.example.movie.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = userService.getAllUsers(pageable, search);
        ApiResponse<Page<UserResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                users,
                "Users retrieved successfully",
                null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        ApiResponse<UserResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                user,
                "User retrieved successfully",
                null);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request) {
        UserResponse updatedUser = userService.updateUserStatus(id, request.isActive());
        ApiResponse<UserResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                updatedUser,
                "User status updated successfully",
                null);
        return ResponseEntity.ok(result);
    }

    // Inner class for request body
    public static class UpdateUserStatusRequest {
        private boolean isActive;

        public boolean isActive() {
            return isActive;
        }

        public void setActive(boolean active) {
            isActive = active;
        }
    }
}
