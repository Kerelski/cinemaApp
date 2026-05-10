package com.cinema.app.userservice.dto;

import com.cinema.app.userservice.model.Role;
import com.cinema.app.userservice.model.User;

import java.time.Instant;
import java.util.Set;

public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        Set<Role> roles,
        boolean enabled,
        Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}
