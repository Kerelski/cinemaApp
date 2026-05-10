package com.cinema.app.userservice.config;

import com.cinema.app.userservice.model.Role;
import com.cinema.app.userservice.model.User;
import com.cinema.app.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.first-name}")
    private String adminFirstName;

    @Value("${app.admin.last-name}")
    private String adminLastName;

    @Override
    public void run(String... args) {
        String normalizedEmail = adminEmail.toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            return;
        }

        userRepository.save(User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(adminPassword))
                .firstName(adminFirstName)
                .lastName(adminLastName)
                .roles(Set.of(Role.ADMIN, Role.USER))
                .enabled(true)
                .build());
    }
}
