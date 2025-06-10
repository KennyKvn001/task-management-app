package org.example.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.example.api.dtos.UserApiDTO;

import java.util.List;

@RegisterRestClient(configKey = "external-user-api")
@Path("/users")
public interface UserApiClient {

    @GET
    List<UserApiDTO> getUsers();
}
