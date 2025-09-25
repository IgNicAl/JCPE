package br.com.jcpm.api.controller;

import br.com.jcpm.api.enums.TipoUsuario;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "http://localhost:3000")
public class InitController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        try {
            // Verificar se já existe um admin
            if (userService.existsByUsername("admin")) {
                return ResponseEntity.ok("Administrador já existe no sistema!");
            }

            // Criar usuário administrador
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@jcpm.com");
            admin.setPassword(passwordEncoder.encode("admcesar"));
            admin.setNome("Administrador do Sistema");
            admin.setTipoUsuario(TipoUsuario.ADMIN);
            admin.setAtivo(true);
            admin.setDataCadastro(LocalDateTime.now());
            admin.setBiografia("Administrador responsável pelo sistema JCPM");
            admin.setUrlImagemPerfil("https://via.placeholder.com/150");

            userService.save(admin);

            return ResponseEntity.ok("Administrador criado com sucesso!\nUsername: admin\nSenha: admcesar");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar administrador: " + e.getMessage());
        }
    }

    @PostMapping("/create-test-users")
    public ResponseEntity<?> createTestUsers() {
        try {
            // Criar jornalista 1
            if (!userService.existsByUsername("jornalista1")) {
                User jornalista1 = new User();
                jornalista1.setUsername("jornalista1");
                jornalista1.setEmail("jornalista1@jcpm.com");
                jornalista1.setPassword(passwordEncoder.encode("123456"));
                jornalista1.setNome("Maria Silva");
                jornalista1.setTipoUsuario(TipoUsuario.JORNALISTA);
                jornalista1.setAtivo(true);
                jornalista1.setDataCadastro(LocalDateTime.now());
                jornalista1.setBiografia("Jornalista especializada em política e economia");
                jornalista1.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(jornalista1);
            }

            // Criar jornalista 2
            if (!userService.existsByUsername("jornalista2")) {
                User jornalista2 = new User();
                jornalista2.setUsername("jornalista2");
                jornalista2.setEmail("jornalista2@jcpm.com");
                jornalista2.setPassword(passwordEncoder.encode("123456"));
                jornalista2.setNome("João Santos");
                jornalista2.setTipoUsuario(TipoUsuario.JORNALISTA);
                jornalista2.setAtivo(true);
                jornalista2.setDataCadastro(LocalDateTime.now());
                jornalista2.setBiografia("Jornalista de esportes e entretenimento");
                jornalista2.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(jornalista2);
            }

            // Criar usuário comum 1
            if (!userService.existsByUsername("usuario1")) {
                User usuario1 = new User();
                usuario1.setUsername("usuario1");
                usuario1.setEmail("usuario1@jcpm.com");
                usuario1.setPassword(passwordEncoder.encode("123456"));
                usuario1.setNome("Ana Costa");
                usuario1.setTipoUsuario(TipoUsuario.USUARIO);
                usuario1.setAtivo(true);
                usuario1.setDataCadastro(LocalDateTime.now());
                usuario1.setBiografia("Leitora assídua de notícias");
                usuario1.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(usuario1);
            }

            // Criar usuário comum 2
            if (!userService.existsByUsername("usuario2")) {
                User usuario2 = new User();
                usuario2.setUsername("usuario2");
                usuario2.setEmail("usuario2@jcpm.com");
                usuario2.setPassword(passwordEncoder.encode("123456"));
                usuario2.setNome("Pedro Oliveira");
                usuario2.setTipoUsuario(TipoUsuario.USUARIO);
                usuario2.setAtivo(true);
                usuario2.setDataCadastro(LocalDateTime.now());
                usuario2.setBiografia("Interessado em tecnologia e inovação");
                usuario2.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(usuario2);
            }

            return ResponseEntity.ok("Usuários de teste criados com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar usuários de teste: " + e.getMessage());
        }
    }
}
