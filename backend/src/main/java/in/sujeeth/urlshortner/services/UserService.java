package in.sujeeth.urlshortner.services;

import in.sujeeth.urlshortner.dtos.SigninRequest;
import in.sujeeth.urlshortner.dtos.SignupRequest;
import in.sujeeth.urlshortner.models.User;
import in.sujeeth.urlshortner.repositories.UserRepository;
import in.sujeeth.urlshortner.security.jwt.JwtAuthenticationResponse;
import in.sujeeth.urlshortner.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@AllArgsConstructor
public class UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private JwtUtils jwtUtils;
    private AuthenticationManager authenticationManager;

    public User signupUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with given email id");
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER")
                .build();
        userRepository.save(user);
        return user;
    }

    public JwtAuthenticationResponse signin(SigninRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);
        return new JwtAuthenticationResponse(token);
    }
}
