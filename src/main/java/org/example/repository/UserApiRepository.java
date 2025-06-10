package org.example.repository;

import jakarta.enterprise.context.ApplicationScoped;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.example.entities.User;

@ApplicationScoped
public class UserApiRepository implements PanacheRepository<User> {}

