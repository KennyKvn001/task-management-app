package org.example.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.example.entities.Task;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class TaskRepository implements PanacheRepository<Task> {

    @PersistenceContext
    EntityManager em;

    public List<Task> findUpcomingTasks(LocalDate from, LocalDate to) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Task> cq = cb.createQuery(Task.class);
        Root<Task> taskRoot = cq.from(Task.class);

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysLater = today.plusDays(7);

        Predicate dateRange = cb.between(taskRoot.get("dueDate"), today, sevenDaysLater);
        cq.select(taskRoot).where(dateRange).distinct(true);

        return em.createQuery(cq).getResultList();
    }
}
