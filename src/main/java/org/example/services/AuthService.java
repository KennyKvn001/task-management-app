package org.example.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.example.auth.dtos.LoginRequestDTO;
import org.example.auth.dtos.LoginResponseDTO;
import org.example.auth.dtos.RegisterRequestDTO;

import org.example.entities.User;
import org.example.entities.UserRole;
import org.example.repository.RoleRepository;
import org.example.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;

    @Inject
    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                      TokenService tokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public void register(RegisterRequestDTO request) {
        validateRegistrationRequest(request);

        User user = userRepository.findByUsername(request.username());

        if (user == null) {
            throw new IllegalArgumentException("User not found. Only synced users can register.");
        }

        if (!user.getEmail().equals(request.email())) {
            throw new IllegalArgumentException("Username and email do not match. Please provide the correct information.");
        }

        if (user.getPasswordHash() != null) {
            throw new IllegalArgumentException("User is already registered");
        }

        UserRole managerRole = roleRepository.findByName("USER");
        if (managerRole == null) {
            managerRole = new UserRole("USER");
            roleRepository.persist(managerRole);
        }
        user.setRole(managerRole);

        String hashedPassword = BCrypt.hashpw(request.password(), BCrypt.gensalt());
        user.setPasswordHash(hashedPassword);

    }

    private void validateRegistrationRequest(RegisterRequestDTO request) {
        if (request.email() == null
                || request.email().trim().isEmpty()
                || request.password() == null
                || request.password().trim().isEmpty()
                || request.username() == null
                || request.username().trim().isEmpty()) {
            throw new IllegalArgumentException("All fields are required");
        }
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        if (loginRequest.email() == null
                || loginRequest.email().trim().isEmpty()
                || loginRequest.password() == null
                || loginRequest.password().trim().isEmpty()) {
            throw new IllegalArgumentException("Email and password are required");
        }

        User user = userRepository.findByEmail(loginRequest.email());

        if (user == null) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (user.getPasswordHash() == null) {
            throw new IllegalArgumentException("User is not registered");
        }

        if (!BCrypt.checkpw(loginRequest.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = tokenService.generateToken(user);

        return new LoginResponseDTO(token, user.getUsername(), user.getRole().getRole());
    }
}
