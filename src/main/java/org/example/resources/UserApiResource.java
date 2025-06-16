package org.example.resources;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.example.entities.User;
import org.example.services.UserApiService;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
public class UserApiResource {

    @Inject
    UserApiService userApiservice;


    @GET
    public List<User> getUsers() {
        return userApiservice.getAllUsers();
    }
}
