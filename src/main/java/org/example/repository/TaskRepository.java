package org.example.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.example.entities.Task;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import java.util.List;

@ApplicationScoped
public class TaskRepository implements PanacheRepository<Task> {
    public Task findTaskById(Long id) {
        CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<Task> query = cb.createQuery(Task.class);
        Root<Task> root = query.from(Task.class);

        query.select(root).where(cb.equal(root.get("id"), id));

        return getEntityManager().createQuery(query).getResultStream().findFirst().orElse(null);
    }

    public List<Task> findAllTasks() {
        CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
        CriteriaQuery<Task> query = cb.createQuery(Task.class);
        Root<Task> root = query.from(Task.class);
        query.select(root);

        return getEntityManager().createQuery(query).getResultList();
    }
}