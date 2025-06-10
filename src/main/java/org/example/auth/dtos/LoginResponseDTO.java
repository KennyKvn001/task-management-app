package org.example.auth.dtos;

public record LoginResponseDTO(
    String token,
    String username,
    String role
) {}
