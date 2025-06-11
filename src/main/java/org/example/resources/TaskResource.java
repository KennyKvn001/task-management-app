package org.example.resources;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.example.services.TaskService;
import org.example.task.dtos.TaskRequestDTO;
import org.example.task.dtos.TaskResponseDTO;

import java.util.List;

@Path("/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    TaskService taskService;

    // Use SecurityContext to obtain the authenticated user's identifier
    @POST
    @Path("/new")
    @RolesAllowed("USER")
    @Transactional
    public Response createTask(@Context SecurityContext securityContext, TaskRequestDTO dto) {
        String creatorEmail = securityContext.getUserPrincipal().getName();
        TaskResponseDTO response = taskService.createTask(creatorEmail, dto);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("USER")
    @Transactional
    public Response updateTask(@PathParam("id") Long id, TaskRequestDTO dto) {
        TaskResponseDTO response = taskService.updateTask(id, dto);
        return Response.ok(response).build();
    }

    @GET
    public Response getAllTasks() {
        List<TaskResponseDTO> tasks = taskService.getAllTasks();
        return Response.ok(tasks).build();
    }

    @GET
    @Path("/{id}")
    public Response getTaskById(@PathParam("id") Long id) {
        TaskResponseDTO task = taskService.getTaskById(id);
        return Response.ok(task).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("USER")
    @Transactional
    public Response deleteTask(@PathParam("id") Long id) {
        taskService.deleteTask(id);
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/complete")
    @RolesAllowed("USER")
    @Transactional
    public Response markTaskCompleted(@PathParam("id") Long taskId, @QueryParam("userId") Long userId) {
        TaskResponseDTO task = taskService.markTaskCompleted(taskId, userId);
        return Response.ok(task).build();
    }
}
