package br.com.jcpm.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.jcpm.api.model.User;
import br.com.jcpm.api.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return user;
    }

    public User save(User user) {
        // Validar se username já existe
        if (user.getId() == null && existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username já está em uso: " + user.getUsername());
        }
        
        // Validar se email já existe
        if (user.getId() == null && existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já está em uso: " + user.getEmail());
        }
        
        // Criptografar senha apenas se for um novo usuário ou se a senha foi alterada
        if (user.getId() == null || user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User update(User user) {
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
    
    // Métodos adicionais para funcionalidades específicas
    public List<User> findByTipoUsuario(br.com.jcpm.api.enums.TipoUsuario tipoUsuario) {
        return userRepository.findAll().stream()
                .filter(user -> user.getTipoUsuario().equals(tipoUsuario))
                .toList();
    }
    
    public List<User> findUsuariosAtivos() {
        return userRepository.findAll().stream()
                .filter(User::getAtivo)
                .toList();
    }
    
    public User ativarUsuario(Long id) {
        User user = findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        user.setAtivo(true);
        return userRepository.save(user);
    }
    
    public User desativarUsuario(Long id) {
        User user = findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        user.setAtivo(false);
        return userRepository.save(user);
    }
    
    public long countUsuarios() {
        return userRepository.count();
    }
    
    public long countUsuariosPorTipo(br.com.jcpm.api.enums.TipoUsuario tipoUsuario) {
        return userRepository.findAll().stream()
                .filter(user -> user.getTipoUsuario().equals(tipoUsuario))
                .count();
    }
}