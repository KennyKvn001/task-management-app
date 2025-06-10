package org.example.api.dtos;

public record AddressDTO(
        String street,
        String suite,
        String city,
        String zipcode,
        GeoDTO geo
) {}

