package org.example.task.dtos;

import java.time.LocalDate;
import java.util.Set;

public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        LocalDate dueDate,
        String createdBy,
        Set<String> assignedUsers,
        Set<String> completedUsers
) {}
