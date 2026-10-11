package com.cbc.cadresbcscompas.controller;

import com.cbc.cadresbcscompas.dto.GoogleLoginRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    // TODO: Add UserRepository and JwtUtil autowiring here

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required from Google.");
        }

        // TODO: Database connection logic needs to be implemented by backend developer
        // Currently returning a dummy success response so frontend doesn't crash
        
        String dummyToken = "dummy-token-for-" + request.getEmail();
        String responseMessage = "Success Token: " + dummyToken + " Role: STUDENT";
        
        return ResponseEntity.ok(responseMessage);
    }
}
