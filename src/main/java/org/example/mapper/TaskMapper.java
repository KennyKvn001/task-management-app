package org.example.mapper;

import org.example.entities.Task;
import org.example.entities.User;
import org.example.task.dtos.TaskRequestDTO;
import org.example.task.dtos.TaskResponseDTO;


import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class TaskMapper {

    private TaskMapper() {}

    public static Task toEntity(TaskRequestDTO dto, User creator, Set<User> assignedUsers) {
        Task task = new Task(dto.title(), dto.description(), dto.dueDate(), creator);
        task.setAssignedUsers(assignedUsers);
        task.setCompletedUsers(new HashSet<>());
        return task;
    }

    public static TaskResponseDTO toDTO(Task task) {
        Set<String> assigned = task.getAssignedUsers().stream().map(User::getUsername).collect(Collectors.toSet());
        Set<String> completed = task.getCompletedUsers().stream().map(User::getUsername).collect(Collectors.toSet());

        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getCreatedBy().getUsername(),
                assigned,
                completed
        );
    }
}
