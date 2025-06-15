package org.example.mapper;

import org.example.api.dtos.UserApiDTO;
import org.example.entities.Address;
import org.example.entities.Company;
import org.example.entities.User;
import org.example.entities.Geo;

public class UserApiMapper {
    private UserApiMapper() {}

    public static User toEntity(UserApiDTO dto) {
        User user = new User();
        user.setExternalId(dto.id());
        user.setName(dto.name());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        user.setWebsite(dto.website());

        Address address = new Address();
        address.setStreet(dto.address().street());
        address.setSuite(dto.address().suite());
        address.setCity(dto.address().city());
        address.setZipcode(dto.address().zipcode());

        Geo geo = new Geo();
        geo.setLat(dto.address().geo().lat());
        geo.setLng(dto.address().geo().lng());
        address.setGeo(geo);
        user.setAddress(address);

        Company company = new Company();
        company.setCompanyName(dto.company().name());
        company.setCatchPhrase(dto.company().catchPhrase());
        company.setBs(dto.company().bs());
        user.setCompany(company);

        return user;
    }
}

