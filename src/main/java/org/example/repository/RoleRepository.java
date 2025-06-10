package org.example.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.example.entities.UserRole;

import java.util.Optional;

@ApplicationScoped
public class RoleRepository implements PanacheRepository<UserRole> {
    public UserRole findByName(String name) {
        CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<UserRole> query = cb.createQuery(UserRole.class);
        Root<UserRole> root = query.from(UserRole.class);

        query.select(root).where(cb.equal(root.get("role"), name));

        return getEntityManager().createQuery(query).getResultStream().findFirst().orElse(null);
    }
}
