package com.example.movie.exception;

public class InvalidId extends RuntimeException {
    public InvalidId(Long id) {
        super(id + " is not available");
    }
}
