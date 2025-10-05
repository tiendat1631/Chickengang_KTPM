package com.example.movie.exception;

public class UsernameAlreadyExistException extends RuntimeException{
    public UsernameAlreadyExistException(String username){
        super("Username already exists!");
    }
}
