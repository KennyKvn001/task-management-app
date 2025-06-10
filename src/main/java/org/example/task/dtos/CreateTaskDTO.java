package org.example.task.dtos;

import java.time.LocalDate;
import java.util.Set;

public record CreateTaskDTO(
        String title,
        String description,
        LocalDate dueDate,
        Set<Long> internalUserIds,
        Set<Long> externalUserIds,
        Long creatorId
) {}
