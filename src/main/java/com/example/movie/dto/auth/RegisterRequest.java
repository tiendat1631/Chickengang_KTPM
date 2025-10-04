package com.example.movie.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String address;

    @NotBlank
    private String phoneNumber;
}
