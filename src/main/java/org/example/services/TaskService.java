package org.example.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.example.entities.Task;
import org.example.entities.User;
import org.example.mapper.TaskMapper;
import org.example.repository.TaskRepository;
import org.example.repository.UserRepository;
import org.example.task.dtos.TaskRequestDTO;
import org.example.task.dtos.TaskResponseDTO;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class TaskService {

    @Inject
    TaskRepository taskRepository;

    @Inject
    UserRepository userRepository;

    @Transactional
    public TaskResponseDTO createTask(String creatorEmail, TaskRequestDTO dto) {
        User creator = userRepository.findByEmail(creatorEmail);
        if (creator == null) {
            throw new IllegalArgumentException("Creator not found");
        }

        Set<Long> userIds = dto.assignedUserIds() == null ? new HashSet<>() : dto.assignedUserIds();
        Set<User> assignedUsers = userIds.stream()
                .map(userRepository::findById)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Task task = TaskMapper.toEntity(dto, creator, assignedUsers);
        taskRepository.persist(task);

        return TaskMapper.toDTO(task);
    }

    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAllTasks().stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findTaskById(id);
        if (task == null) throw new IllegalArgumentException("Task not found");
        return TaskMapper.toDTO(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findTaskById(id);
        if (task == null) {
            throw new IllegalArgumentException("Task not found");
        }
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponseDTO markTaskCompleted(Long taskId, Long userId) {
        Task task = taskRepository.findTaskById(taskId);
        if (task == null) throw new IllegalArgumentException("Task not found");

        User user = userRepository.findById(userId);
        if (user == null) throw new IllegalArgumentException("User not found");

        if (task.getAssignedUsers().stream().noneMatch(u -> u.getExternalId().equals(user.getExternalId()))) {
            throw new IllegalArgumentException("Only assigned users can complete the task");
        }

        task.getCompletedUsers().add(user);

        return TaskMapper.toDTO(task);
    }

    @Transactional
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO dto) {
        Task task = taskRepository.findTaskById(id);
        if (task == null) {
            throw new IllegalArgumentException("Task not found");
        }

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setDueDate(dto.dueDate());

        Set<Long> userIds = dto.assignedUserIds() == null ? new HashSet<>() : dto.assignedUserIds();
        Set<User> assignedUsers = userIds.stream()
                .map(userRepository::findById)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        task.setAssignedUsers(assignedUsers);

        return TaskMapper.toDTO(task);
    }
}