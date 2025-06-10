package org.example.api.dtos;

public record UserApiDTO(
        Long id,
        String name,
        String username,
        String email,
        String phone,
        String website,
        AddressDTO address,
        CompanyDTO company
) {}

