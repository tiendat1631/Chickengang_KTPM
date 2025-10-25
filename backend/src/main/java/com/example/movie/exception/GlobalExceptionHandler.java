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

    @ExceptionHandler(InvalidCredentialException.class)
    private ResponseEntity<ApiResponse<Void>> handleInvalidCredentialException (InvalidCredentialException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.UNAUTHORIZED,
                null,
                ex.getMessage(),
                "INVALID_CREDENTIAL"
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotFoundException.class)
    private ResponseEntity<ApiResponse<Void>> handleUserNotFoundException (UserNotFoundException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.NOT_FOUND,
                null,
                ex.getMessage(),
                "USER_NOT_FOUND"
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidId.class)
    private ResponseEntity<ApiResponse<Void>> handleInvalidId (InvalidId id) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.CONFLICT,
                null,
                id.getMessage(),
                "INVALID_ID"
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SeatNotAvailableException.class)
    private ResponseEntity<ApiResponse<Void>> handleSeatNotAvailableException (SeatNotAvailableException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.CONFLICT,
                null,
                ex.getMessage(),
                "SEAT_NOT_AVAILABLE"
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AuthenticationRequiredException.class)
    private ResponseEntity<ApiResponse<Void>> handleAuthenticationRequiredException (AuthenticationRequiredException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.UNAUTHORIZED,
                null,
                ex.getMessage(),
                "AUTHENTICATION_REQUIRED"
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SeatNotFoundException.class)
    private ResponseEntity<ApiResponse<Void>> handleSeatNotFoundException (SeatNotFoundException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.NOT_FOUND,
                null,
                ex.getMessage(),
                "SEAT_NOT_FOUND"
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    private ResponseEntity<ApiResponse<Void>> handleRuntimeException (RuntimeException ex) {
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                null,
                ex.getMessage(),
                "INTERNAL_SERVER_ERROR"
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    private ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException (org.springframework.dao.DataIntegrityViolationException ex) {
        String message = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        if (ex.getMessage().contains("Duplicate entry")) {
            message = "Ghế đã được đặt. Vui lòng chọn ghế khác.";
        }
        
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.CONFLICT,
                null,
                message,
                "DATA_INTEGRITY_VIOLATION"
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

}
