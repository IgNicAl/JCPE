package br.com.jcpm.api.service;

import br.com.jcpm.api.enums.TipoUsuario;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Corrigido: Injeção de dependência via construtor.
    // @Lazy no PasswordEncoder resolve a dependência circular com WebSecurityConfig.
    public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    public User save(User user) {
        // Corrigido: Validação de existência de usuário e e-mail antes de salvar
        if (user.getId() == null) { // Apenas para novos usuários
            if (existsByUsername(user.getUsername())) {
                throw new IllegalStateException("Username já está em uso: " + user.getUsername());
            }
            if (existsByEmail(user.getEmail())) {
                throw new IllegalStateException("Email já está em uso: " + user.getEmail());
            }
        }

        // Corrigido: A senha SEMPRE deve ser criptografada ao salvar um novo usuário
        user.setPassword(passwordEncoder.encode(user.getPassword()));

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
        if (!userRepository.existsById(id)) {
            throw new UsernameNotFoundException("Usuário não encontrado com ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public List<User> findByTipoUsuario(TipoUsuario tipoUsuario) {
        return userRepository.findAll().stream()
                .filter(user -> user.getTipoUsuario().equals(tipoUsuario))
                .toList();
    }

    public User ativarUsuario(Long id) {
        User user = findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com ID: " + id));
        user.setAtivo(true);
        return userRepository.save(user);
    }

    public User desativarUsuario(Long id) {
        User user = findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com ID: " + id));
        user.setAtivo(false);
        return userRepository.save(user);
    }

    public long countUsuarios() {
        return userRepository.count();
    }

    public long countUsuariosPorTipo(TipoUsuario tipoUsuario) {
        return userRepository.findAll().stream()
                .filter(user -> user.getTipoUsuario().equals(tipoUsuario))
                .count();
    }
}
