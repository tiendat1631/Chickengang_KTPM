package com.example.movie.exception;

public class AuditoriumInUseException extends RuntimeException {
    public AuditoriumInUseException(String message) {
        super(message);
    }
}

