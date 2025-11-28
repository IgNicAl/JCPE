package br.com.jcpm.api.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.dto.AllJournalistsStatsDTO;
import br.com.jcpm.api.dto.JournalistStatsDTO;
import br.com.jcpm.api.service.JournalistStatsService;
import lombok.RequiredArgsConstructor;

/**
 * Controller para endpoints de estatísticas de jornalistas
 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class JournalistStatsController {

  private final JournalistStatsService journalistStatsService;

  /**
   * Obtém estatísticas do jornalista logado
   * Acessível por JOURNALIST e ADMIN
   */
  @GetMapping("/my-stats")
  @PreAuthorize("hasAnyRole('JOURNALIST', 'ADMIN')")
  public ResponseEntity<JournalistStatsDTO> getMyStats() {
    try {
      JournalistStatsDTO stats = journalistStatsService.getMyStats();
      return ResponseEntity.ok(stats);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  /**
   * Obtém estatísticas de um jornalista específico
   * Acessível apenas por ADMIN
   */
  @GetMapping("/journalist/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<JournalistStatsDTO> getJournalistStats(@PathVariable UUID id) {
    try {
      JournalistStatsDTO stats = journalistStatsService.getJournalistStats(id);
      return ResponseEntity.ok(stats);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  /**
   * Obtém estatísticas de todos os jornalistas
   * Acessível apenas por ADMIN
   */
  @GetMapping("/journalists/all")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AllJournalistsStatsDTO> getAllJournalistsStats() {
    try {
      AllJournalistsStatsDTO stats = journalistStatsService.getAllJournalistsStats();
      return ResponseEntity.ok(stats);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }
}
