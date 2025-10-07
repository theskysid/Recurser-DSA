package com.dsatracker.controller;

import com.dsatracker.dto.JwtResponse;
import com.dsatracker.dto.LoginRequest;
import com.dsatracker.dto.MessageResponse;
import com.dsatracker.dto.SignupRequest;
import com.dsatracker.entity.User;
import com.dsatracker.repository.UserRepository;
import com.dsatracker.security.JwtUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${app.jwt.cookie.name:jwt-token}")
    private String jwtCookieName;

    @Value("${app.jwt.cookie.maxAge:86400}")
    private int jwtCookieMaxAge;

    @Autowired
    private Environment environment;

    private Cookie buildJwtCookie(String jwt) {
        boolean isProd = false;
        String[] active = environment.getActiveProfiles();
        if (active != null) {
            for (String p : active) {
                if (p.equalsIgnoreCase("prod") || p.equalsIgnoreCase("production")) {
                    isProd = true;
                    break;
                }
            }
        }
        // If not explicitly prod but host will be HTTPS (Render), we still treat as prod when not running on localhost
        // This keeps local dev (localhost) workable without Secure cookie blocking in plain HTTP.
        if (!isProd) {
            // Heuristic: if NEON / cloud DB profile active we assume remote deployment
            if (Arrays.stream(active).anyMatch(p -> p.contains("neon"))) {
                isProd = true;
            }
        }

        Cookie jwtCookie = new Cookie(jwtCookieName, jwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(jwtCookieMaxAge);
        if (isProd) {
            // Cross-site between Netlify (frontend) and Render (backend)
            jwtCookie.setSecure(true);
            jwtCookie.setAttribute("SameSite", "None");
        } else {
            // Local development (no HTTPS) cannot use SameSite=None + Secure
            jwtCookie.setSecure(false);
            jwtCookie.setAttribute("SameSite", "Lax");
        }
        return jwtCookie;
    }

    private Cookie buildClearingCookie() {
        Cookie clear = buildJwtCookie("");
        clear.setValue("");
        clear.setMaxAge(0);
        return clear;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User userDetails = (User) authentication.getPrincipal();

        Cookie jwtCookie = buildJwtCookie(jwt);
        response.addCookie(jwtCookie);

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        Cookie clear = buildClearingCookie();
        response.addCookie(clear);

        return ResponseEntity.ok(new MessageResponse("Logged out successfully!"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}