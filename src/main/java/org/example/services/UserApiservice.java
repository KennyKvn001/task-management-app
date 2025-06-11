package org.example.services;

import io.quarkus.scheduler.Scheduled;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.example.api.UserApiClient;
import org.example.mapper.UserApiMapper;
import org.example.api.dtos.UserApiDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.example.entities.User;
import org.example.entities.UserRole;
import org.example.repository.RoleRepository;
import org.example.repository.UserApiRepository;

import java.util.List;

@ApplicationScoped
public class UserApiservice {

    private final RoleRepository roleRepository;
    @RestClient
    UserApiClient userApiClient;
    private final UserApiRepository userApiRepository;

    @Inject
    public UserApiservice(UserApiRepository userApiRepository, RoleRepository roleRepository) {
        this.userApiRepository = userApiRepository;
        this.roleRepository = roleRepository;
    }

//    five minutes
    @Scheduled(cron ="0 * * * * ?")
    @Transactional
    public void syncUsers() {

        UserRole userRole = roleRepository.findByName("PUBLIC");
        if (userRole == null) {
            userRole = new UserRole("PUBLIC");
            userApiRepository.getEntityManager().persist(userRole);
        }

        List<UserApiDTO> dtos = userApiClient.getUsers();
        for (UserApiDTO dto : dtos) {
            User existingUser = userApiRepository.findById(dto.id());

            if (existingUser == null) {
                User user = UserApiMapper.toEntity(dto);
                user.setRole(userRole);

                userApiRepository.persist(user);
            } else {
                existingUser.setName(dto.name());
                existingUser.setUsername(dto.username());
                existingUser.setEmail(dto.email());
                existingUser.setPhone(dto.phone());
                existingUser.setWebsite(dto.website());

                if (!hasCustomRole(existingUser)) {
                    existingUser.setRole(userRole);
                }

                existingUser.getAddress().setStreet(dto.address().street());
                existingUser.getAddress().setSuite(dto.address().suite());
                existingUser.getAddress().setCity(dto.address().city());
                existingUser.getAddress().setZipcode(dto.address().zipcode());
                existingUser.getAddress().getGeo().setLat(dto.address().geo().lat());
                existingUser.getAddress().getGeo().setLng(dto.address().geo().lng());

                existingUser.getCompany().setCompanyName(dto.company().name());
                existingUser.getCompany().setCatchPhrase(dto.company().catchPhrase());
                existingUser.getCompany().setBs(dto.company().bs());
            }
        }
    }

    private boolean hasCustomRole(User user) {
        return user.getRole() != null && !"PUBLIC".equalsIgnoreCase(user.getRole().getRole());
    }

    public List<User> getAllUsers() {
        return userApiRepository.listAll();
    }
}

