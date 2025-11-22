package br.com.jcpm.api.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.dto.NewsReviewLogResponse;
import br.com.jcpm.api.dto.ReviewActionRequest;
import br.com.jcpm.api.service.NewsReviewService;
import jakarta.validation.Valid;

/**
 * Controller para workflow de revisão de notícias.
 * Apenas ADMIN e REVIEWER têm acesso.
 */
@RestController
@RequestMapping("/api/news/review")
public class NewsReviewController {

  private final NewsReviewService newsReviewService;

  public NewsReviewController(NewsReviewService newsReviewService) {
    this.newsReviewService = newsReviewService;
  }

  /**
   * Listar notícias pendentes de revisão.
   */
  @GetMapping("/pending")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<List<News>> getPendingReviews(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    Pageable pageable = PageRequest.of(page, size);
    List<News> pending = newsReviewService.getPendingReviews(pageable);
    return ResponseEntity.ok(pending);
  }

  /**
   * Listar notícias já revisadas (aprovadas/rejeitadas).
   * Por padrão, últimos 30 dias.
   */
  @GetMapping("/reviewed")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<List<News>> getReviewedNews(
      @RequestParam(required = false) String startDate,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {

    LocalDateTime start = startDate != null
        ? LocalDateTime.parse(startDate)
        : LocalDateTime.now().minusDays(30);

    Pageable pageable = PageRequest.of(page, size);
    List<News> reviewed = newsReviewService.getReviewedNews(start, pageable);
    return ResponseEntity.ok(reviewed);
  }

  /**
   * Aprovar e publicar/agendar notícia.
   */
  @PostMapping("/{newsId}/approve")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<?> approveNews(
      @PathVariable UUID newsId,
      @Valid @RequestBody ReviewActionRequest request) {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      User currentUser = (User) authentication.getPrincipal();

      News approved = newsReviewService.approveNews(newsId, request, currentUser);
      return ResponseEntity.ok(approved);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest()
          .body(Collections.singletonMap("error", e.getMessage()));
    }
  }

  /**
   * Rejeitar notícia.
   */
  @PostMapping("/{newsId}/reject")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<?> rejectNews(
      @PathVariable UUID newsId,
      @RequestBody String comment) {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      User currentUser = (User) authentication.getPrincipal();

      News rejected = newsReviewService.rejectNews(newsId, comment, currentUser);
      return ResponseEntity.ok(rejected);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest()
          .body(Collections.singletonMap("error", e.getMessage()));
    }
  }

  /**
   * Solicitar mudanças na notícia.
   */
  @PostMapping("/{newsId}/request-changes")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<?> requestChanges(
      @PathVariable UUID newsId,
      @RequestBody String comment) {
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      User currentUser = (User) authentication.getPrincipal();

      News updated = newsReviewService.requestChanges(newsId, comment, currentUser);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest()
          .body(Collections.singletonMap("error", e.getMessage()));
    }
  }

  /**
   * Buscar histórico de revisões de uma notícia.
   */
  @GetMapping("/{newsId}/history")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<List<NewsReviewLogResponse>> getReviewHistory(@PathVariable UUID newsId) {
    List<NewsReviewLogResponse> history = newsReviewService.getReviewHistory(newsId);
    return ResponseEntity.ok(history);
  }

  /**
   * Submeter notícia para revisão (usado por jornalistas).
   */
  @PostMapping("/{newsId}/submit")
  @PreAuthorize("hasRole('JOURNALIST') or hasRole('ADMIN')")
  public ResponseEntity<?> submitForReview(@PathVariable UUID newsId) {
    try {
      News submitted = newsReviewService.submitForReview(newsId);
      return ResponseEntity.ok(submitted);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest()
          .body(Collections.singletonMap("error", e.getMessage()));
    }
  }
}
