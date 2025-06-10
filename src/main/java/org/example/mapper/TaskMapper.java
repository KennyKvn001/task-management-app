package org.example.mapper;

import org.example.entities.Task;
import org.example.entities.User;
import org.example.task.dtos.TaskResponseDTO;

import java.util.stream.Collectors;

public class TaskMapper {
    public static TaskResponseDTO toResponseDTO(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getCreatedBy().getUsername(),
                task.getAssignedUsers().stream()
                        .map(User::getUsername).collect(Collectors.toSet()),
                task.getCompletedUsers().stream()
                        .map(User::getUsername).collect(Collectors.toSet())
        );
    }
}
