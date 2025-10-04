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

    @ExceptionHandler(EmailAlreadyExistException.class)
    private ResponseEntity<ApiResponse<Void>> handleEmailAlreadyExistException (EmailAlreadyExistException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.CONFLICT,
                null,
                ex.getMessage(),
                "EMAIL_ALREADY_EXISTS"
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(InvalidRoleException.class)
    private ResponseEntity<ApiResponse<Void>> handleInvalidRoleException (InvalidRoleException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST,
                null,
                ex.getMessage(),
                "INVALID_ROLE"
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
