package org.example.task.dtos;

import java.time.LocalDate;
import java.util.Set;

public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        LocalDate dueDate,
        String createdByUsername,
        Set<String> assignedUsernames,
        Set<String> completedUsernames
) {}
