package org.example.services;

import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import org.example.entities.User;
import io.smallrye.jwt.build.Jwt;

import java.time.Duration;
import java.util.Collections;

@ApplicationScoped
public class TokenService {

    public String generateToken(User user) {
        try {
            String role = user.getRole().getRole();

            return Jwt.issuer("task-management-app")
                    .subject(user.getEmail())
                    .groups(Collections.singleton(role))
                    .claim("username", user.getUsername())
                    .expiresIn(Duration.ofHours(24))
                    .sign();
        }catch (Exception e){
            Log.info(e);
            return null;
        }
    }
}
