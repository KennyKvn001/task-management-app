package org.example.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long externalId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = true)
    private String passwordHash;

    private String phone;
    private String website;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private UserRole role;

    @OneToMany(mappedBy = "createdBy")
    @JsonIgnore
    private Set<Task> createdTasks;

    @ManyToMany(mappedBy = "assignedUsers")
    @JsonIgnore
    private Set<Task> tasksAssigned;

    @ManyToMany(mappedBy = "completedUsers")
    @JsonIgnore
    private Set<Task> tasksCompleted;

    public User() {}

    public User(Long externalId, String username, String email, String passwordHash) {
        this.externalId = externalId;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Set<Task> getCreatedTasks() {
        return createdTasks;
    }

    public void setCreatedTasks(Set<Task> createdTasks) {
        this.createdTasks = createdTasks;
    }

    public Set<Task> getTasksAssigned() {
        return tasksAssigned;
    }

    public void setTasksAssigned(Set<Task> tasksAssigned) {
        this.tasksAssigned = tasksAssigned;
    }

    public Set<Task> getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(Set<Task> tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }
}