package com.example.movie.dto.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


@Data
public class ApiResponse <T>{
    private String status;
    private T data;
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;

    public ApiResponse(HttpStatus status, T data, String message, String errorCode) {
        this.status = status.is2xxSuccessful() ? "success" : "error";
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
        this.timestamp = LocalDateTime.now();
    }
}
