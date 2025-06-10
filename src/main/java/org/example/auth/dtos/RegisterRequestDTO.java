package org.example.auth.dtos;

public record RegisterRequestDTO(
    String username,
    String email,
    String password
) {}
