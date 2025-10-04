package com.example.movie.exception;

public class EmailAlreadyExistException extends RuntimeException{
    public EmailAlreadyExistException(String email){
        super("this email already exist " + email);
    }
}
