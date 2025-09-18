package br.com.jcpm.api.controller;

import br.com.jcpm.api.model.User;
import br.com.jcpm.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint público para ver perfil de qualquer usuário
    @GetMapping("/perfil/{username}")
    public ResponseEntity<User> getPerfilPublico(@PathVariable String username) {
        Optional<User> user = userService.findByUsername(username);
        if (user.isPresent()) {
            User userProfile = user.get();
            // Remove informações sensíveis
            userProfile.setPassword(null);
            return ResponseEntity.ok(userProfile);
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint para ver próprio perfil (autenticado)
    @GetMapping("/me")
    @PreAuthorize("hasRole('USUARIO') or hasRole('JORNALISTA') or hasRole('ADMIN')")
    public ResponseEntity<User> getMeuPerfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        user.setPassword(null); // Remove senha da resposta
        return ResponseEntity.ok(user);
    }

    // Endpoint para atualizar próprio perfil
    @PutMapping("/me")
    @PreAuthorize("hasRole('USUARIO') or hasRole('JORNALISTA') or hasRole('ADMIN')")
    public ResponseEntity<User> updateMeuPerfil(@RequestBody User userDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        // Atualiza apenas campos permitidos
        currentUser.setNome(userDetails.getNome());
        currentUser.setEmail(userDetails.getEmail());
        currentUser.setBiografia(userDetails.getBiografia());
        currentUser.setUrlImagemPerfil(userDetails.getUrlImagemPerfil());

        User updatedUser = userService.update(currentUser);
        updatedUser.setPassword(null); // Remove senha da resposta
        return ResponseEntity.ok(updatedUser);
    }

    // Listar todos os usuários (apenas para ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        List<User> users = userService.findAll();
        // Remove senhas da resposta
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    // Buscar usuário por ID (apenas para ADMIN)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> {
                    user.setPassword(null); // Remove senha da resposta
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar qualquer usuário (apenas para ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.findById(id)
                .map(user -> {
                    user.setNome(userDetails.getNome());
                    user.setEmail(userDetails.getEmail());
                    user.setBiografia(userDetails.getBiografia());
                    user.setUrlImagemPerfil(userDetails.getUrlImagemPerfil());
                    user.setTipoUsuario(userDetails.getTipoUsuario());
                    user.setAtivo(userDetails.getAtivo());
                    
                    User updatedUser = userService.update(user);
                    updatedUser.setPassword(null); // Remove senha da resposta
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar usuário (apenas para ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> {
                    userService.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}