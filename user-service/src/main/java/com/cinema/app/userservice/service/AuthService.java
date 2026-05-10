package com.cinema.app.userservice.service;

import com.cinema.app.userservice.dto.AuthResponse;
import com.cinema.app.userservice.dto.LoginRequest;
import com.cinema.app.userservice.dto.RegisterRequest;
import com.cinema.app.userservice.dto.UserResponse;
import com.cinema.app.userservice.model.Role;
import com.cinema.app.userservice.model.User;
import com.cinema.app.userservice.repository.UserRepository;
import com.cinema.app.userservice.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = userRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .roles(Set.of(Role.USER))
                .enabled(true)
                .build());

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return new AuthResponse(
                "Bearer",
                jwtService.generateToken(user),
                jwtService.getExpirationSeconds(),
                UserResponse.from(user)
        );
    }
}
