package com.cadresbcs.compass.controller;

import com.cadresbcs.compass.dto.GoogleLoginRequest;
import com.cadresbcs.compass.model.User;
import com.cadresbcs.compass.model.Role;
import com.cadresbcs.compass.repository.UserRepository;
import com.cadresbcs.compass.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required from Google.");
        }

        // Check if user already exists
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        User user;

        if (existingUserOpt.isPresent()) {
            // User exists, proceed to generate token
            user = existingUserOpt.get();
        } else {
            // New user, save to database
            user = new User();
            user.setName(request.getName() != null && !request.getName().isEmpty() ? request.getName() : "Google User");
            user.setEmail(request.getEmail());
            user.setPassword("GOOGLE_AUTH_" + request.getUid()); // Dummy password for OAuth
            user.setRole(Role.STUDENT); // Default role
            userRepository.save(user);
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // Response format matching frontend expectation
        String responseMessage = "Success Token: " + token + " Role: " + user.getRole().name();
        
        return ResponseEntity.ok(responseMessage);
    }
}
