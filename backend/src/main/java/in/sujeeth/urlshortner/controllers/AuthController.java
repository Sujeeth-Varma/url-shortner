package in.sujeeth.urlshortner.controllers;

import in.sujeeth.urlshortner.dtos.SigninRequest;
import in.sujeeth.urlshortner.dtos.SignupRequest;
import in.sujeeth.urlshortner.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/public/signup")
    public ResponseEntity<?> register(@RequestBody SignupRequest request) {
        try {
            userService.signupUser(request);
            return ResponseEntity.ok("User registered");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/public/signin")
    public ResponseEntity<?> signin(@RequestBody SigninRequest request) {
        try {
            return ResponseEntity.ok(userService.signin(request));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}
