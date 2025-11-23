package br.com.jcpm.api.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity; // Importar o novo DTO
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.UserType;
import br.com.jcpm.api.dto.PointsResponse;
import br.com.jcpm.api.dto.ScreenTimeRequest;
import br.com.jcpm.api.dto.UserResponse;
import br.com.jcpm.api.dto.UserUpdateRequest;
import br.com.jcpm.api.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  public record UserStats(
      long totalUsers, long totalAdmins, long totalJournalists, long totalCommonUsers) {
  }

  @GetMapping("/perfil/{username}")
  public ResponseEntity<UserResponse> getPublicProfile(@PathVariable String username) {
    return userService
        .findByUsername(username)
        .map(user -> ResponseEntity.ok(new UserResponse(user)))
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserResponse> getMyProfile() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User user = userService
        .findByUsername(authentication.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    return ResponseEntity.ok(new UserResponse(user));
  }

  @PostMapping("/me/screentime")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserResponse> addScreenTime(@RequestBody ScreenTimeRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    try {
      User updated = userService.incrementScreenTime(username, request.getSeconds());
      return ResponseEntity.ok(new UserResponse(updated));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/me/points")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<PointsResponse> getMyPoints() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    long total = userService.getTotalScreenTimeSeconds(username);
    int points = userService.getPoints(username);
    return ResponseEntity.ok(new PointsResponse(total, points));
  }

  @PutMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<UserResponse> updateMyProfile(@RequestBody UserUpdateRequest userDetails) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = userService.findByUsername(authentication.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

    // Only update fields that are not null
    if (userDetails.getName() != null) {
      currentUser.setName(userDetails.getName());
    }
    if (userDetails.getEmail() != null) {
      currentUser.setEmail(userDetails.getEmail());
    }
    if (userDetails.getBiografia() != null) {
      currentUser.setBiography(userDetails.getBiografia());
    }
    if (userDetails.getUrlImagemPerfil() != null) {
      currentUser.setProfileImageUrl(userDetails.getUrlImagemPerfil());
    }
    if (userDetails.getBannerUrl() != null) {
      currentUser.setBannerUrl(userDetails.getBannerUrl());
    }

    // Process password change if requested
    if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
      try {
        userService.updatePassword(currentUser, userDetails.getPassword(), userDetails.getOldPassword());
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
      }
    }

    User updatedUser = userService.update(currentUser);
    return ResponseEntity.ok(new UserResponse(updatedUser));
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserResponse> getAllUsers() {
    return userService.findAll().stream().map(UserResponse::new).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
    return userService
        .findById(id)
        .map(user -> ResponseEntity.ok(new UserResponse(user)))
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> updateUser(
      @PathVariable UUID id, @RequestBody UserUpdateRequest userDetails) {
    Optional<User> userOptional = userService.findById(id);

    if (userOptional.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    User user = userOptional.get();

    // Only update fields that are not null
    if (userDetails.getName() != null) {
      user.setName(userDetails.getName());
    }
    if (userDetails.getEmail() != null) {
      user.setEmail(userDetails.getEmail());
    }
    if (userDetails.getBiografia() != null) {
      user.setBiography(userDetails.getBiografia());
    }
    if (userDetails.getUrlImagemPerfil() != null) {
      user.setProfileImageUrl(userDetails.getUrlImagemPerfil());
    }
    if (userDetails.getBannerUrl() != null) {
      user.setBannerUrl(userDetails.getBannerUrl());
    }
    if (userDetails.getUserType() != null) {
      user.setUserType(userDetails.getUserType());
    }
    if (userDetails.getAtivo() != null) {
      user.setActive(userDetails.getAtivo());
    }

    // Process password change if requested (admin can reset without old password)
    if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
      try {
        userService.resetPassword(user, userDetails.getPassword());
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
      }
    }

    User updatedUser = userService.update(user);
    return ResponseEntity.ok(new UserResponse(updatedUser));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
    try {
      userService.deleteById(id);
      return ResponseEntity.noContent().build();
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}/ativar")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> activateUser(@PathVariable UUID id) {
    try {
      User user = userService.activateUser(id);
      return ResponseEntity.ok(new UserResponse(user));
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping("/{id}/desativar")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponse> deactivateUser(@PathVariable UUID id) {
    try {
      User user = userService.deactivateUser(id);
      return ResponseEntity.ok(new UserResponse(user));
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/tipo/{tipoUser}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<UserResponse>> getUsersByType(@PathVariable("tipoUser") String userTypeString) {
    try {
      UserType type = UserType.valueOf(userTypeString.toUpperCase());
      List<UserResponse> users = userService.findByUserType(type).stream()
          .map(UserResponse::new)
          .collect(Collectors.toList());
      return ResponseEntity.ok(users);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/stats")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserStats> getUserStats() {
    long totalUsers = userService.countUsers();
    long totalAdmins = userService.countUsersByType(UserType.ADMIN);
    long totalJournalists = userService.countUsersByType(UserType.JOURNALIST);
    long totalCommonUsers = userService.countUsersByType(UserType.USER);

    return ResponseEntity.ok(
        new UserStats(totalUsers, totalAdmins, totalJournalists, totalCommonUsers));
  }
}
