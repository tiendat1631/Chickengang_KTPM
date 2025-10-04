package com.example.movie.exception;


import com.example.movie.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameAlreadyExistException.class)
    private ResponseEntity<ApiResponse<Void>> handleUsernameAlreadyExistException (UsernameAlreadyExistException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
            HttpStatus.CONFLICT,
            null,
                ex.getMessage(),
                "USERNAME_ALREADY_EXISTS"
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}
