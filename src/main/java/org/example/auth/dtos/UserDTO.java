package org.example.auth.dtos;

import org.example.api.dtos.AddressDTO;
import org.example.api.dtos.CompanyDTO;

import java.util.Set;

public record UserDTO(
        Long id,
        Long externalId,
        String name,
        String username,
        String email,
        String phone,
        String website,
        AddressDTO address,
        CompanyDTO company,
        String role,
        Set<Long> createdTaskIds,
        Set<Long> assignedTaskIds,
        Set<Long> completedTaskIds
) {
}
