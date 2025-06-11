package org.example.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.example.entities.User;
import org.example.repository.UserRepository;
import org.example.services.TaskService;
import org.example.task.dtos.TaskRequestDTO;
import org.example.task.dtos.TaskResponseDTO;

import java.util.List;
import java.util.Map;

@Path("/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    TaskService taskService;

    @Inject
    UserRepository userRepository;

    @POST
    @Path("/new")
    @RolesAllowed("USER")
    @Transactional
    public Response createTask(@Context SecurityContext securityContext, TaskRequestDTO dto) {
        try {
            String creatorEmail = securityContext.getUserPrincipal().getName();
            TaskResponseDTO response = taskService.createTask(creatorEmail, dto);
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", "An unexpected error occurred: " + e.getMessage()))
                .build();
        }
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("USER")
    @Transactional
    public Response updateTask(@PathParam("id") Long id, TaskRequestDTO dto) {
        try {
            TaskResponseDTO response = taskService.updateTask(id, dto);
            return Response.ok(response).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", "An unexpected error occurred: " + e.getMessage()))
                .build();
        }
    }

    @GET
    public Response getAllTasks() {
        try {
            List<TaskResponseDTO> tasks = taskService.getAllTasks();
            return Response.ok(tasks).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", "An unexpected error occurred: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Path("/{id}")
    public Response getTaskById(@PathParam("id") Long id) {
        try {
            TaskResponseDTO task = taskService.getTaskById(id);
            return Response.ok(task).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", "An unexpected error occurred: " + e.getMessage()))
                .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("USER")
    @Transactional
    public Response deleteTask(@PathParam("id") Long id) {
        try {
            taskService.deleteTask(id);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity(Map.of("error", e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", "An unexpected error occurred: " + e.getMessage()))
                .build();
        }
    }

    @POST
    @Path("/{id}/complete")
    @RolesAllowed("USER")
    @Transactional
    public Response markTaskCompleted(@Context SecurityContext securityContext, @PathParam("id") Long taskId) {
        try {
            String userEmail = securityContext.getUserPrincipal().getName();
            User user = userRepository.findByEmail(userEmail);

            if (user == null) {
                return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "User not found"))
                    .build();
            }

            TaskResponseDTO task = taskService.markTaskCompleted(taskId, user.getExternalId());
            return Response.ok(task).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", "An unexpected error occurred: " + e.getMessage()))
                .build();
        }
    }
}
