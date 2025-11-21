package br.com.jcpm.api.controller;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.NewsComment;
import br.com.jcpm.api.domain.entity.NewsLike;
import br.com.jcpm.api.domain.entity.NewsRating;
import br.com.jcpm.api.domain.entity.NewsShare;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.dto.NewsCommentRequest;
import br.com.jcpm.api.dto.NewsCommentResponse;
import br.com.jcpm.api.dto.NewsLikeResponse;
import br.com.jcpm.api.dto.NewsRatingRequest;
import br.com.jcpm.api.dto.NewsRequest;
import br.com.jcpm.api.dto.NewsStatsResponse;
import br.com.jcpm.api.repository.CategoryRepository;
import br.com.jcpm.api.repository.NewsCommentRepository;
import br.com.jcpm.api.repository.NewsLikeRepository;
import br.com.jcpm.api.repository.NewsRatingRepository;
import br.com.jcpm.api.repository.NewsRepository;
import br.com.jcpm.api.repository.NewsShareRepository;
import br.com.jcpm.api.repository.TagRepository;
import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/noticias")
public class NewsController {

  private final NewsRepository newsRepository;
  private final NewsLikeRepository newsLikeRepository;
  private final NewsRatingRepository newsRatingRepository;
  private final NewsCommentRepository newsCommentRepository;
  private final NewsShareRepository newsShareRepository;
  private final CategoryRepository categoryRepository;
  private final TagRepository tagRepository;

  public NewsController(
      NewsRepository newsRepository,
      NewsLikeRepository newsLikeRepository,
      NewsRatingRepository newsRatingRepository,
      NewsCommentRepository newsCommentRepository,
      NewsShareRepository newsShareRepository,
      CategoryRepository categoryRepository,
      TagRepository tagRepository) {
    this.newsRepository = newsRepository;
    this.newsLikeRepository = newsLikeRepository;
    this.newsRatingRepository = newsRatingRepository;
    this.newsCommentRepository = newsCommentRepository;
    this.newsShareRepository = newsShareRepository;
    this.categoryRepository = categoryRepository;
    this.tagRepository = tagRepository;
  }


  private String generateSlug(String title) {
    String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    String slug = pattern.matcher(normalized).replaceAll("");
    slug = slug.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", "");

    int count = 1;
    String finalSlug = slug;
    while (newsRepository.existsBySlug(finalSlug)) {
      finalSlug = slug + "-" + count++;
    }
    return finalSlug;
  }

  @GetMapping
  public ResponseEntity<List<News>> getAllPublicNews(
      @RequestParam(required = false) String page,
      @RequestParam(required = false) Boolean featuredHome,
      @RequestParam(required = false) Boolean featuredPage) {

    // Se solicitar notícias em destaque na HOME
    if (featuredHome != null && featuredHome) {
      return ResponseEntity.ok(
          newsRepository.findAllByIsFeaturedHomeAndStatusOrderByPriorityDescPublicationDateDesc(true, "PUBLICADO"));
    }

    // Se solicitar notícias em destaque de uma página específica
    if (featuredPage != null && featuredPage && page != null && !page.isBlank()) {
      return ResponseEntity.ok(
          newsRepository.findAllByPageAndIsFeaturedPageAndStatusOrderByPriorityDescPublicationDateDesc(page, true, "PUBLICADO"));
    }

    // Busca normal por página
    if (page != null && !page.isBlank()) {
      return ResponseEntity.ok(
          newsRepository.findAllByPageAndStatusOrderByPriorityDescPublicationDateDesc(page, "PUBLICADO"));
    }

    // Todas as notícias publicadas
    return ResponseEntity.ok(newsRepository.findAllByStatusOrderByPublicationDateDesc("PUBLICADO"));
  }

  // ROTA CORRIGIDA para evitar ambiguidade
  @GetMapping("/slug/{slug}")
  public ResponseEntity<News> getNewsBySlug(@PathVariable String slug) {
    return newsRepository
        .findBySlug(slug)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping("/manage")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<List<News>> getNewsForManagement() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    if ("ADMIN".equals(currentUser.getUserType().name())) {
      return ResponseEntity.ok(newsRepository.findAll());
    }

    return ResponseEntity.ok(newsRepository.findByAuthorId(currentUser.getId()));
  }

  // Esta rota agora é única para UUIDs
  @GetMapping("/{id}")
  public ResponseEntity<News> getNewsById(@PathVariable UUID id) {
    return newsRepository
        .findById(id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  @PreAuthorize("hasRole('JOURNALIST') or hasRole('ADMIN')")
  public ResponseEntity<News> createNews(@Valid @RequestBody NewsRequest newsRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    News news = new News();
    news.setTitle(newsRequest.getTitle());
    news.setSlug(generateSlug(newsRequest.getTitle()));
    news.setSummary(newsRequest.getSummary());
    news.setContent(newsRequest.getContent());
    news.setContentJson(newsRequest.getContentJson());
    news.setFeaturedImageUrl(newsRequest.getFeaturedImageUrl());
    news.setPriority(newsRequest.getPriority());
    news.setPage(newsRequest.getPage() != null ? newsRequest.getPage() : "noticias");
    news.setIsFeaturedHome(newsRequest.getIsFeaturedHome() != null ? newsRequest.getIsFeaturedHome() : false);
    news.setIsFeaturedPage(newsRequest.getIsFeaturedPage() != null ? newsRequest.getIsFeaturedPage() : false);
    news.setAuthor(currentUser);
    news.setPublicationDate(LocalDateTime.now());
    news.setStatus(newsRequest.getStatus() != null ? newsRequest.getStatus() : "PUBLICADO");

    // Definir categoria
    if (newsRequest.getCategoryId() != null) {
      categoryRepository.findById(newsRequest.getCategoryId()).ifPresent(news::setCategory);
    }

    // Definir tags
    if (newsRequest.getTagIds() != null && !newsRequest.getTagIds().isEmpty()) {
      news.getTags().addAll(
        tagRepository.findAllById(newsRequest.getTagIds())
      );
    }

    News savedNews = newsRepository.save(news);
    return new ResponseEntity<>(savedNews, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<?> updateNews(@PathVariable UUID id, @Valid @RequestBody NewsRequest newsRequest) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    return newsRepository
        .findById(id)
        .map(
            news -> {
              boolean isOwner = news.getAuthor().getId().equals(currentUser.getId());
              boolean isAdmin = "ADMIN".equals(currentUser.getUserType().name());

              if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                        Collections.singletonMap(
                            "error", "Você não tem permissão para editar esta notícia."));
              }

              news.setTitle(newsRequest.getTitle());
              news.setSummary(newsRequest.getSummary());
              news.setContent(newsRequest.getContent());
              news.setContentJson(newsRequest.getContentJson());
              news.setFeaturedImageUrl(newsRequest.getFeaturedImageUrl());
              news.setPriority(newsRequest.getPriority());
              news.setPage(newsRequest.getPage() != null ? newsRequest.getPage() : news.getPage());
              news.setIsFeaturedHome(
                  newsRequest.getIsFeaturedHome() != null ? newsRequest.getIsFeaturedHome() : news.getIsFeaturedHome());
              news.setIsFeaturedPage(
                  newsRequest.getIsFeaturedPage() != null ? newsRequest.getIsFeaturedPage() : news.getIsFeaturedPage());
              news.setUpdateDate(LocalDateTime.now());
              news.setStatus(newsRequest.getStatus() != null ? newsRequest.getStatus() : news.getStatus());

              // Atualizar categoria
              if (newsRequest.getCategoryId() != null) {
                categoryRepository.findById(newsRequest.getCategoryId()).ifPresent(news::setCategory);
              } else {
                news.setCategory(null);
              }

              // Atualizar tags
              news.getTags().clear();
              if (newsRequest.getTagIds() != null && !newsRequest.getTagIds().isEmpty()) {
                news.getTags().addAll(
                  tagRepository.findAllById(newsRequest.getTagIds())
                );
              }

              News updatedNews = newsRepository.save(news);
              return ResponseEntity.ok(updatedNews);
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('JOURNALIST')")
  public ResponseEntity<?> deleteNews(@PathVariable UUID id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    return newsRepository
        .findById(id)
        .map(
            news -> {
              boolean isOwner = news.getAuthor().getId().equals(currentUser.getId());
              boolean isAdmin = "ADMIN".equals(currentUser.getUserType().name());

              if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(
                        Collections.singletonMap(
                            "error", "Você não tem permissão para excluir esta notícia."));
              }

              newsRepository.delete(news);
              return ResponseEntity.noContent().build();
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  /**
   * Busca todas as notícias curtidas pelo usuário logado
   */
  @GetMapping("/liked")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<List<NewsLikeResponse>> getLikedNews() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    List<NewsLike> likes = newsLikeRepository.findAllByUserIdOrderByLikedAtDesc(currentUser.getId());
    List<NewsLikeResponse> response = likes.stream()
        .map(NewsLikeResponse::new)
        .collect(java.util.stream.Collectors.toList());

    return ResponseEntity.ok(response);
  }

  /**
   * Curtir uma notícia
   */
  @PostMapping("/{newsId}/like")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> likeNews(@PathVariable UUID newsId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    // Verificar se a notícia existe
    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    // Verificar se já curtiu
    if (newsLikeRepository.existsByUserIdAndNewsId(currentUser.getId(), newsId)) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(Collections.singletonMap("error", "Você já curtiu esta notícia."));
    }

    // Criar o like
    NewsLike newsLike = new NewsLike();
    newsLike.setUserId(currentUser.getId());
    newsLike.setNewsId(newsId);
    newsLikeRepository.save(newsLike);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Collections.singletonMap("message", "Notícia curtida com sucesso."));
  }

  /**
   * Descurtir uma notícia
   */
  @DeleteMapping("/{newsId}/like")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> unlikeNews(@PathVariable UUID newsId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    // Verificar se curtiu a notícia
    if (!newsLikeRepository.existsByUserIdAndNewsId(currentUser.getId(), newsId)) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Collections.singletonMap("error", "Você não curtiu esta notícia."));
    }

    // Remover o like
    newsLikeRepository.deleteByUserIdAndNewsId(currentUser.getId(), newsId);

    return ResponseEntity.ok(Collections.singletonMap("message", "Like removido com sucesso."));
  }

  // ========== ENDPOINTS DE AVALIAÇÃO (RATING) ==========

  /**
   * Avaliar uma notícia (1-5 estrelas)
   */
  @PostMapping("/{newsId}/rate")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> rateNews(
      @PathVariable UUID newsId,
      @Valid @RequestBody NewsRatingRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    // Verificar se a notícia existe
    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    // Verificar se já avaliou
    var existingRating = newsRatingRepository.findByUserIdAndNewsId(currentUser.getId(), newsId);

    if (existingRating.isPresent()) {
      // Atualizar avaliação existente
      NewsRating rating = existingRating.get();
      rating.setRating(request.getRating());
      newsRatingRepository.save(rating);
      return ResponseEntity.ok(Collections.singletonMap("message", "Avaliação atualizada com sucesso."));
    } else {
      // Criar nova avaliação
      NewsRating newsRating = new NewsRating();
      newsRating.setUserId(currentUser.getId());
      newsRating.setNewsId(newsId);
      newsRating.setRating(request.getRating());
      newsRatingRepository.save(newsRating);
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(Collections.singletonMap("message", "Notícia avaliada com sucesso."));
    }
  }

  /**
   * Obter média de avaliações de uma notícia
   */
  @GetMapping("/{newsId}/rating")
  public ResponseEntity<?> getNewsRating(@PathVariable UUID newsId) {
    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    Double average = newsRatingRepository.getAverageRatingByNewsId(newsId);
    long count = newsRatingRepository.countByNewsId(newsId);

    return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
      put("averageRating", average != null ? average : 0.0);
      put("totalRatings", count);
    }});
  }

  /**
   * Obter avaliação do usuário logado para uma notícia
   */
  @GetMapping("/{newsId}/user-rating")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> getUserRating(@PathVariable UUID newsId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    var rating = newsRatingRepository.findByUserIdAndNewsId(currentUser.getId(), newsId);

    if (rating.isPresent()) {
      return ResponseEntity.ok(Collections.singletonMap("rating", rating.get().getRating()));
    }

    return ResponseEntity.ok(Collections.singletonMap("rating", null));
  }

  // ========== ENDPOINTS DE COMENTÁRIOS ==========

  /**
   * Buscar todos os comentários de uma notícia
   */
  @GetMapping("/{newsId}/comments")
  public ResponseEntity<List<NewsCommentResponse>> getNewsComments(@PathVariable UUID newsId) {
    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    List<NewsComment> comments = newsCommentRepository.findAllByNewsIdAndParentIsNullOrderByCreatedAtDesc(newsId);
    List<NewsCommentResponse> response = comments.stream()
        .map(NewsCommentResponse::new)
        .collect(java.util.stream.Collectors.toList());

    return ResponseEntity.ok(response);
  }

  /**
   * Adicionar comentário a uma notícia
   */
  @PostMapping("/{newsId}/comments")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> addComment(
      @PathVariable UUID newsId,
      @Valid @RequestBody NewsCommentRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    NewsComment comment = new NewsComment();
    comment.setNewsId(newsId);
    comment.setUserId(currentUser.getId());
    comment.setContent(request.getContent());

    if (request.getParentId() != null && !request.getParentId().isEmpty()) {
      try {
        java.util.UUID parentUuid = java.util.UUID.fromString(request.getParentId());
        newsCommentRepository.findById(parentUuid).ifPresent(comment::setParent);
      } catch (IllegalArgumentException e) {
        // Ignore invalid UUID
      }
    }

    NewsComment savedComment = newsCommentRepository.save(comment);

    // Recarregar com dados do usuário
    NewsComment fullComment = newsCommentRepository.findById(savedComment.getId()).orElse(savedComment);

    return ResponseEntity.status(HttpStatus.CREATED).body(new NewsCommentResponse(fullComment));
  }

  /**
   * Deletar comentário (próprio ou admin)
   */
  @DeleteMapping("/comments/{commentId}")
  @PreAuthorize("isAuthenticated()")
  @org.springframework.transaction.annotation.Transactional
  public ResponseEntity<?> deleteComment(@PathVariable UUID commentId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    return newsCommentRepository.findById(commentId)
        .map(comment -> {
          boolean isOwner = comment.getUserId().equals(currentUser.getId());
          boolean isAdmin = "ADMIN".equals(currentUser.getUserType().name());

          if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Collections.singletonMap("error", "Você não tem permissão para deletar este comentário."));
          }

          // Se for uma resposta, remover da lista do pai para evitar problemas de persistência
          if (comment.getParent() != null) {
            comment.getParent().getReplies().remove(comment);
          }

          newsCommentRepository.delete(comment);
          return ResponseEntity.ok(Collections.singletonMap("message", "Comentário deletado com sucesso."));
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  // ========== ENDPOINTS DE COMPARTILHAMENTO ==========

  /**
   * Registrar compartilhamento de notícia
   */
  @PostMapping("/{newsId}/share")
  public ResponseEntity<?> shareNews(@PathVariable UUID newsId) {
    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    // Verificar se está autenticado
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UUID userId = null;

    if (authentication != null && authentication.getPrincipal() instanceof User) {
      User currentUser = (User) authentication.getPrincipal();
      userId = currentUser.getId();
    }

    NewsShare share = new NewsShare();
    share.setNewsId(newsId);
    share.setUserId(userId); // Pode ser null se não autenticado
    newsShareRepository.save(share);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Collections.singletonMap("message", "Compartilhamento registrado com sucesso."));
  }

  // ========== ENDPOINT DE ESTATÍSTICAS ==========

  /**
   * Obter todas as estatísticas de uma notícia (likes, shares, comments, rating)
   */
  @GetMapping("/{newsId}/stats")
  public ResponseEntity<NewsStatsResponse> getNewsStats(@PathVariable UUID newsId) {
    if (!newsRepository.existsById(newsId)) {
      return ResponseEntity.notFound().build();
    }

    long likesCount = newsLikeRepository.countByNewsId(newsId);
    long sharesCount = newsShareRepository.countByNewsId(newsId);
    long commentsCount = newsCommentRepository.countByNewsId(newsId);
    Double averageRating = newsRatingRepository.getAverageRatingByNewsId(newsId);
    long totalRatings = newsRatingRepository.countByNewsId(newsId);

    boolean userHasLiked = false;
    Integer userRating = null;

    // Se usuário está autenticado, buscar suas interações
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof User) {
      User currentUser = (User) authentication.getPrincipal();
      userHasLiked = newsLikeRepository.existsByUserIdAndNewsId(currentUser.getId(), newsId);

      var rating = newsRatingRepository.findByUserIdAndNewsId(currentUser.getId(), newsId);
      if (rating.isPresent()) {
        userRating = rating.get().getRating();
      }
    }

    NewsStatsResponse stats = new NewsStatsResponse(
        likesCount,
        sharesCount,
        commentsCount,
        averageRating != null ? averageRating : 0.0,
        totalRatings,
        userHasLiked,
        userRating
    );

    return ResponseEntity.ok(stats);
  }

  /**
   * Contar notícias por autor
   */
  @GetMapping("/author/{authorId}/count")
  public ResponseEntity<?> getAuthorPostCount(@PathVariable UUID authorId) {
    long count = newsRepository.countByAuthorId(authorId);
    return ResponseEntity.ok(Collections.singletonMap("count", count));
  }

  /**
   * Obter Top 3 Notícias (Recentes)
   */
  @GetMapping("/top")
  public ResponseEntity<List<News>> getTopNews() {
    return ResponseEntity.ok(newsRepository.findTop3ByStatusOrderByPublicationDateDesc("PUBLICADO"));
  }
}

