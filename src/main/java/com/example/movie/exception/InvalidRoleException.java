package com.example.movie.exception;

public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException(String role) {
        super("sai role " + role);
    }
}
