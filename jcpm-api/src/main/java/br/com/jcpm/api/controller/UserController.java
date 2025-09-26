package br.com.jcpm.api.controller;

import br.com.jcpm.api.dto.UserResponse;
import br.com.jcpm.api.enums.TipoUsuario;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
// Corrigido: Padronizando o endpoint para /api/users
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Endpoint público para ver perfil de qualquer usuário
    @GetMapping("/perfil/{username}")
    public ResponseEntity<UserResponse> getPerfilPublico(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(user -> ResponseEntity.ok(new UserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para ver próprio perfil (autenticado)
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getMeuPerfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Corrigido: Busca o usuário pelo serviço para garantir que os dados estão atualizados
        User user = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return ResponseEntity.ok(new UserResponse(user));
    }

    // Endpoint para atualizar próprio perfil
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateMeuPerfil(@RequestBody User userDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.findByUsername(authentication.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // Atualiza apenas campos permitidos
        currentUser.setNome(userDetails.getNome());
        currentUser.setEmail(userDetails.getEmail());
        currentUser.setBiografia(userDetails.getBiografia());
        currentUser.setUrlImagemPerfil(userDetails.getUrlImagemPerfil());

        User updatedUser = userService.update(currentUser);
        return ResponseEntity.ok(new UserResponse(updatedUser));
    }

    // Listar todos os usuários (apenas para ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        // Corrigido: Mapeia a lista de User para uma lista de UserResponse
        return userService.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    // Buscar usuário por ID (apenas para ADMIN)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(new UserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar qualquer usuário (apenas para ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.findById(id)
                .map(user -> {
                    user.setNome(userDetails.getNome());
                    user.setEmail(userDetails.getEmail());
                    user.setBiografia(userDetails.getBiografia());
                    user.setUrlImagemPerfil(userDetails.getUrlImagemPerfil());
                    user.setTipoUsuario(userDetails.getTipoUsuario());
                    user.setAtivo(userDetails.getAtivo());

                    User updatedUser = userService.update(user);
                    return ResponseEntity.ok(new UserResponse(updatedUser));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar usuário (apenas para ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Outros Endpoints de Gerenciamento (ADMIN) ---

    // Ativar usuário (apenas para ADMIN)
    @PutMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> ativarUser(@PathVariable Long id) {
        try {
            User user = userService.ativarUsuario(id);
            return ResponseEntity.ok(new UserResponse(user));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Desativar usuário (apenas para ADMIN)
    @PutMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> desativarUser(@PathVariable Long id) {
        try {
            User user = userService.desativarUsuario(id);
            return ResponseEntity.ok(new UserResponse(user));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Listar usuários por tipo (apenas para ADMIN)
    @GetMapping("/tipo/{tipoUsuario}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByTipo(@PathVariable String tipoUsuario) {
        try {
            TipoUsuario tipo = TipoUsuario.valueOf(tipoUsuario.toUpperCase());
            List<UserResponse> users = userService.findByTipoUsuario(tipo).stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Retorna 400 se o tipo de usuário for inválido
        }
    }

    // Estatísticas de usuários (apenas para ADMIN)
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserStats> getUserStats() {
        long totalUsuarios = userService.countUsuarios();
        long totalAdmins = userService.countUsuariosPorTipo(TipoUsuario.ADMIN);
        long totalJornalistas = userService.countUsuariosPorTipo(TipoUsuario.JORNALISTA);
        long totalUsuariosComuns = userService.countUsuariosPorTipo(TipoUsuario.USUARIO);

        return ResponseEntity.ok(new UserStats(totalUsuarios, totalAdmins, totalJornalistas, totalUsuariosComuns));
    }

    // Classe interna para DTO de estatísticas
    public record UserStats(long totalUsuarios, long totalAdmins, long totalJornalistas, long totalUsuariosComuns) {}
}
