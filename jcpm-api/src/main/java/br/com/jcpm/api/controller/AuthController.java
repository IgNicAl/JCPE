package br.com.jcpm.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.dto.JwtResponse;
import br.com.jcpm.api.dto.LoginRequest;
import br.com.jcpm.api.dto.RegisterRequest;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.security.JwtUtil;
import br.com.jcpm.api.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken((User) authentication.getPrincipal());

        User userPrincipal = (User) authentication.getPrincipal();
        return ResponseEntity.ok(new JwtResponse(jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getNome(),
                userPrincipal.getTipoUsuario()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            // Verificar se username já existe
            if (userService.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("USERNAME_EXISTS", "Username já está em uso: " + signUpRequest.getUsername()));
            }

            // Verificar se email já existe
            if (userService.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("EMAIL_EXISTS", "Email já está em uso: " + signUpRequest.getEmail()));
            }

            // Create new user's account
            User user = new User(signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword(),
                    signUpRequest.getNome());

            user.setTipoUsuario(signUpRequest.getTipoUsuario());
            user.setBiografia(signUpRequest.getBiografia());
            user.setUrlImagemPerfil(signUpRequest.getUrlImagemPerfil());

            User savedUser = userService.save(user);
            
            // Retornar dados do usuário criado (sem senha)
            savedUser.setPassword(null);
            return ResponseEntity.ok(new SuccessResponse("User registered successfully!", savedUser));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("REGISTRATION_ERROR", "Erro ao registrar usuário: " + e.getMessage()));
        }
    }

    // Classes para respostas padronizadas
    public static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() { return error; }
        public String getMessage() { return message; }
    }

    public static class SuccessResponse {
        private String message;
        private User user;

        public SuccessResponse(String message, User user) {
            this.message = message;
            this.user = user;
        }

        public String getMessage() { return message; }
        public User getUser() { return user; }
    }
}