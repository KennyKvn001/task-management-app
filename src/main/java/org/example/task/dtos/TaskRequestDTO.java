package org.example.task.dtos;

import java.time.LocalDate;
import java.util.Set;

public record TaskRequestDTO(
        String title,
        String description,
        LocalDate dueDate,
        Set<Long> assignedUserIds
) {}
