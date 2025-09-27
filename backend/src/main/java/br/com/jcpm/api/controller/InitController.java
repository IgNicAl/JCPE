package br.com.jcpm.api.controller;

import br.com.jcpm.api.enums.TipoUser;
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
            admin.setName("Administrador do Sistema");
            admin.setTipoUser(TipoUser.ADMIN);
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
                jornalista1.setName("Maria Silva");
                jornalista1.setTipoUser(TipoUser.JORNALISTA);
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
                jornalista2.setName("João Santos");
                jornalista2.setTipoUser(TipoUser.JORNALISTA);
                jornalista2.setAtivo(true);
                jornalista2.setDataCadastro(LocalDateTime.now());
                jornalista2.setBiografia("Jornalista de esportes e entretenimento");
                jornalista2.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(jornalista2);
            }

            // Criar usuário comum 1
            if (!userService.existsByUsername("user1")) {
                User user1 = new User();
                user1.setUsername("user1");
                user1.setEmail("user1@jcpm.com");
                user1.setPassword(passwordEncoder.encode("123456"));
                user1.setName("Ana Costa");
                user1.setTipoUser(TipoUser.USER);
                user1.setAtivo(true);
                user1.setDataCadastro(LocalDateTime.now());
                user1.setBiografia("Leitora assídua de notícias");
                user1.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(user1);
            }

            // Criar usuário comum 2
            if (!userService.existsByUsername("user2")) {
                User user2 = new User();
                user2.setUsername("user2");
                user2.setEmail("user2@jcpm.com");
                user2.setPassword(passwordEncoder.encode("123456"));
                user2.setName("Pedro Oliveira");
                user2.setTipoUser(TipoUser.USER);
                user2.setAtivo(true);
                user2.setDataCadastro(LocalDateTime.now());
                user2.setBiografia("Interessado em tecnologia e inovação");
                user2.setUrlImagemPerfil("https://via.placeholder.com/150");
                userService.save(user2);
            }

            return ResponseEntity.ok("Usuários de teste criados com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar usuários de teste: " + e.getMessage());
        }
    }
}
