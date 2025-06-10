package org.example.auth.dtos;

public record LoginRequestDTO(
    String email,
    String password
) {
}
