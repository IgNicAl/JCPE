package br.com.jcpm.api.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.model.CadUser;
import br.com.jcpm.api.repository.CadUserRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class CadUserController {

    @Autowired
    private CadUserRepository cadUserRepository;

    @GetMapping
    public List<CadUser> getAllUsuarios() {
        return cadUserRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CadUser> getUsuarioById(@PathVariable Long id) {
        return cadUserRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CadUser> createUsuario(@RequestBody CadUser usuario) {
        CadUser novoUsuario = cadUserRepository.save(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CadUser> updateUsuario(@PathVariable Long id, @RequestBody CadUser usuarioDetails) {
        return cadUserRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioDetails.getNome());
                    usuario.setSexo(usuarioDetails.getSexo());
                    usuario.setDataNascimento(usuarioDetails.getDataNascimento());
                    usuario.setEmail(usuarioDetails.getEmail());
                    usuario.setSenha(usuarioDetails.getSenha());
                    CadUser updatedUsuario = cadUserRepository.save(usuario);
                    return ResponseEntity.ok(updatedUsuario);
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        return cadUserRepository.findById(id)
                .map(usuario -> {
                    cadUserRepository.delete(usuario);
                    return ResponseEntity.noContent().<Void>build();
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Buscar usuário por email
            CadUser usuario = cadUserRepository.findByEmail(loginRequest.getEmail())
                    .orElse(null);
            
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Usuário não encontrado"));
            }
            
            // Verificar senha (em produção, use BCrypt ou similar)
            if (!usuario.getSenha().equals(loginRequest.getSenha())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Senha incorreta"));
            }
            
            // Retornar dados do usuário (sem a senha)
            LoginResponse response = new LoginResponse();
            response.setId(usuario.getId());
            response.setNome(usuario.getNome());
            response.setEmail(usuario.getEmail());
            response.setSexo(usuario.getSexo());
            response.setDataNascimento(usuario.getDataNascimento());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno do servidor"));
        }
    }

    // Classes internas para requests e responses
    public static class LoginRequest {
        private String email;
        private String senha;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }
    
    public static class LoginResponse {
        private Long id;
        private String nome;
        private String email;
        private String sexo;
        private LocalDateTime dataNascimento;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSexo() { return sexo; }
        public void setSexo(String sexo) { this.sexo = sexo; }
        public LocalDateTime getDataNascimento() { return dataNascimento; }
        public void setDataNascimento(LocalDateTime dataNascimento) { this.dataNascimento = dataNascimento; }
    }
    
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
