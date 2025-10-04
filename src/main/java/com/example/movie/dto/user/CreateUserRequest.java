package com.example.movie.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String address;
    //private String role;

//    @JsonFormat(pattern = "yyyy-MM-dd")
//    private LocalDate dateOfBirth;
}
