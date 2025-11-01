package br.com.jcpm.api.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.UserType;
import br.com.jcpm.api.repository.UserRepository;

/**
 * Serviço que implementa a lógica de negócio para usuários e a interface
 * UserDetailsService do
 * Spring Security.
 */
@Service
public class UserService implements UserDetailsService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
  }

  public User save(User user) {
    if (user.getId() == null) {
      if (existsByUsername(user.getUsername())) {
        throw new IllegalStateException("Username já está em uso: " + user.getUsername());
      }
      if (existsByEmail(user.getEmail())) {
        throw new IllegalStateException("Email já está em uso: " + user.getEmail());
      }
    }
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  public List<User> findAll() {
    return userRepository.findAll();
  }

  public Optional<User> findById(UUID id) {
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

  /**
   * Incrementa o tempo de tela do usuário identificado pelo username em segundos.
   * Aplica uma regra simples de conversão para pontos: 1 ponto a cada 60
   * segundos.
   */
  public User incrementScreenTime(String username, long seconds) {
    if (seconds <= 0) {
      throw new IllegalArgumentException("Seconds must be positive");
    }
    // limite por requisição para evitar abuso (ex.: 1 hora)
    long capped = Math.min(seconds, 3600);

    User user = findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    long previous = user.getTotalScreenTimeSeconds();
    long updated = previous + capped;
    user.setTotalScreenTimeSeconds(updated);

    // converter para pontos: 1 ponto = 60 segundos
    // calcular pontos com base no total acumulado para garantir que pontos sejam
    // concedidos mesmo quando os segundos forem enviados em incrementos menores
    long previousPointsTotal = previous / 60;
    long updatedPointsTotal = updated / 60;
    int deltaPoints = (int) (updatedPointsTotal - previousPointsTotal);
    if (deltaPoints > 0) {
      user.setPoints(user.getPoints() + deltaPoints);
    }

    return userRepository.save(user);
  }

  public long getTotalScreenTimeSeconds(String username) {
    return findByUsername(username).map(User::getTotalScreenTimeSeconds).orElse(0L);
  }

  public int getPoints(String username) {
    return findByUsername(username).map(User::getPoints).orElse(0);
  }

  public void deleteById(UUID id) {
    if (!userRepository.existsById(id)) {
      throw new UsernameNotFoundException("Usuário não encontrado com ID: " + id);
    }
    userRepository.deleteById(id);
  }

  public List<User> findByUserType(UserType userType) {
    return userRepository.findAll().stream()
        .filter(user -> user.getUserType().equals(userType))
        .toList();
  }

  public User activateUser(UUID id) {
    User user = findById(id)
        .orElseThrow(
            () -> new UsernameNotFoundException("Usuário não encontrado com ID: " + id));
    user.setActive(true);
    return userRepository.save(user);
  }

  public User deactivateUser(UUID id) {
    User user = findById(id)
        .orElseThrow(
            () -> new UsernameNotFoundException("Usuário não encontrado com ID: " + id));
    user.setActive(false);
    return userRepository.save(user);
  }

  public long countUsers() {
    return userRepository.count();
  }

  public long countUsersByType(UserType userType) {
    return userRepository.findAll().stream()
        .filter(user -> user.getUserType().equals(userType))
        .count();
  }
}
