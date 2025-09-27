package br.com.jcpm.api.controller;

import br.com.jcpm.api.dto.JwtResponse;
import br.com.jcpm.api.dto.LoginRequest;
import br.com.jcpm.api.dto.RegisterRequest;
import br.com.jcpm.api.dto.UserResponse;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.security.JwtUtil;
import br.com.jcpm.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User userPrincipal = (User) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userPrincipal);

        return ResponseEntity.ok(new JwtResponse(jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getName(),
                userPrincipal.getTipoUser()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        // REMOVIDO: O bloco try-catch agora é desnecessário.
        // O ExceptionHandlerController cuidará dos erros de duplicação de usuário/email.

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword());
        user.setName(signUpRequest.getName());
        user.setTipoUser(signUpRequest.getTipoUser());
        user.setBiografia(signUpRequest.getBiografia());
        user.setUrlImagemPerfil(signUpRequest.getUrlImagemPerfil());

        User savedUser = userService.save(user);

        return ResponseEntity.ok(new UserResponse(savedUser));
    }
}
