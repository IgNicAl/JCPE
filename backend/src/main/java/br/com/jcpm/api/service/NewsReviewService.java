package br.com.jcpm.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.jcpm.api.domain.entity.Category;
import br.com.jcpm.api.domain.entity.HomepageSection;
import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.NewsReviewLog;
import br.com.jcpm.api.domain.entity.Tag;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.NewsStatus;
import br.com.jcpm.api.dto.NewsReviewLogResponse;
import br.com.jcpm.api.dto.ReviewActionRequest;
import br.com.jcpm.api.repository.CategoryRepository;
import br.com.jcpm.api.repository.HomepageSectionRepository;
import br.com.jcpm.api.repository.NewsRepository;
import br.com.jcpm.api.repository.NewsReviewLogRepository;
import br.com.jcpm.api.repository.TagRepository;

/**
 * Service para gerenciamento do workflow de revisão de notícias.
 * Apenas ADMIN e REVIEWER podem usar estes métodos.
 */
@Service
public class NewsReviewService {

  private final NewsRepository newsRepository;
  private final NewsReviewLogRepository reviewLogRepository;
  private final CategoryRepository categoryRepository;
  private final TagRepository tagRepository;
  private final HomepageSectionRepository homepageSectionRepository;

  public NewsReviewService(
      NewsRepository newsRepository,
      NewsReviewLogRepository reviewLogRepository,
      CategoryRepository categoryRepository,
      TagRepository tagRepository,
      HomepageSectionRepository homepageSectionRepository) {
    this.newsRepository = newsRepository;
    this.reviewLogRepository = reviewLogRepository;
    this.categoryRepository = categoryRepository;
    this.tagRepository = tagRepository;
    this.homepageSectionRepository = homepageSectionRepository;
  }

  /**
   * Listar notícias pendentes de revisão.
   */
  public List<News> getPendingReviews(Pageable pageable) {
    return newsRepository.findByStatusOrderByPublicationDateDesc(NewsStatus.PENDING_REVIEW, pageable);
  }

  /**
   * Listar notícias já revisadas (aprovadas ou rejeitadas) após uma data.
   */
  public List<News> getReviewedNews(LocalDateTime startDate, Pageable pageable) {
    List<NewsStatus> reviewedStatuses = List.of(
        NewsStatus.APPROVED,
        NewsStatus.REJECTED,
        NewsStatus.PUBLISHED
    );
    return newsRepository.findByStatusInAndReviewedAtAfter(reviewedStatuses, startDate, pageable);
  }

  /**
   * Aprovar notícia e publicar ou agendar.
   */
  @Transactional
  public News approveNews(UUID newsId, ReviewActionRequest request, User reviewer) {
    News news = newsRepository.findById(newsId)
        .orElseThrow(() -> new IllegalArgumentException("Notícia não encontrada"));

    // Validar que está pendente de revisão
    if (news.getStatus() != NewsStatus.PENDING_REVIEW) {
      throw new IllegalStateException("Apenas notícias pendentes de revisão podem ser aprovadas");
    }

    // Definir categoria (obrigatório)
    Category category = categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    news.setCategory(category);

    // Definir prioridade
    news.setNewsPriority(request.getPriority());

    // Definir tags
    if (request.getTags() != null && !request.getTags().isEmpty()) {
      news.getTags().clear();
      for (String tagName : request.getTags()) {
        // Buscar tag existente ou criar nova
        Tag tag = tagRepository.findByName(tagName)
            .orElseGet(() -> {
              Tag newTag = new Tag();
              newTag.setName(tagName);
              return tagRepository.save(newTag);
            });
        news.getTags().add(tag);
      }
    }

    // Definir seções da homepage
    if (request.getHomepageSectionIds() != null && !request.getHomepageSectionIds().isEmpty()) {
      news.getHomepageSections().clear();
      List<HomepageSection> sections = homepageSectionRepository.findAllById(request.getHomepageSectionIds());
      news.getHomepageSections().addAll(sections);
    }

    // Definir campos SEO
    news.setSeoTitle(request.getSeoTitle());
    news.setSeoMetaDescription(request.getSeoMetaDescription());

    // Definir revisor e data de revisão
    news.setReviewedBy(reviewer);
    news.setReviewedAt(LocalDateTime.now());

    // Se tiver data de agendamento, status = APPROVED; senão, PUBLISHED
    if (request.getScheduledPublishDate() != null) {
      news.setStatus(NewsStatus.APPROVED);
      news.setScheduledPublishDate(request.getScheduledPublishDate());
    } else {
      news.setStatus(NewsStatus.PUBLISHED);
      news.setPublicationDate(LocalDateTime.now());
    }

    News savedNews = newsRepository.save(news);

    // Criar log de auditoria
    createReviewLog(news, reviewer, "APPROVED", request.getComment());

    return savedNews;
  }

  /**
   * Rejeitar notícia.
   */
  @Transactional
  public News rejectNews(UUID newsId, String comment, User reviewer) {
    if (comment == null || comment.isBlank()) {
      throw new IllegalArgumentException("Comentário é obrigatório para rejeição");
    }

    News news = newsRepository.findById(newsId)
        .orElseThrow(() -> new IllegalArgumentException("Notícia não encontrada"));

    // Validar que está pendente de revisão
    if (news.getStatus() != NewsStatus.PENDING_REVIEW) {
      throw new IllegalStateException("Apenas notícias pendentes de revisão podem ser rejeitadas");
    }

    news.setStatus(NewsStatus.REJECTED);
    news.setReviewedBy(reviewer);
    news.setReviewedAt(LocalDateTime.now());

    News savedNews = newsRepository.save(news);

    // Criar log de auditoria
    createReviewLog(news, reviewer, "REJECTED", comment);

    // TODO: Enviar notificação para o autor

    return savedNews;
  }

  /**
   * Solicitar mudanças na notícia.
   */
  @Transactional
  public News requestChanges(UUID newsId, String comment, User reviewer) {
    if (comment == null || comment.isBlank()) {
      throw new IllegalArgumentException("Comentário é obrigatório para solicitar mudanças");
    }

    News news = newsRepository.findById(newsId)
        .orElseThrow(() -> new IllegalArgumentException("Notícia não encontrada"));

    // Validar que está pendente de revisão
    if (news.getStatus() != NewsStatus.PENDING_REVIEW) {
      throw new IllegalStateException("Apenas notícias pendentes de revisão podem ter mudanças solicitadas");
    }

    // Volta para DRAFT para o autor editar
    news.setStatus(NewsStatus.DRAFT);

    News savedNews = newsRepository.save(news);

    // Criar log de auditoria
    createReviewLog(news, reviewer, "REQUESTED_CHANGES", comment);

    // TODO: Enviar notificação para o autor

    return savedNews;
  }

  /**
   * Buscar histórico de revisões de uma notícia.
   */
  public List<NewsReviewLogResponse> getReviewHistory(UUID newsId) {
    List<NewsReviewLog> logs = reviewLogRepository.findByNewsIdOrderByTimestampDesc(newsId);
    return logs.stream()
        .map(NewsReviewLogResponse::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Submeter notícia para revisão (usado pelo autor).
   */
  @Transactional
  public News submitForReview(UUID newsId) {
    News news = newsRepository.findById(newsId)
        .orElseThrow(() -> new IllegalArgumentException("Notícia não encontrada"));

    // Validar que está em DRAFT
    if (news.getStatus() != NewsStatus.DRAFT) {
      throw new IllegalStateException("Apenas rascunhos podem ser submetidos para revisão");
    }

    news.setStatus(NewsStatus.PENDING_REVIEW);
    News savedNews = newsRepository.save(news);

    // TODO: Enviar notificação para revisores

    return savedNews;
  }

  /**
   * Criar registro de log de revisão.
   */
  private void createReviewLog(News news, User reviewer, String action, String comment) {
    NewsReviewLog log = new NewsReviewLog();
    log.setNews(news);
    log.setReviewer(reviewer);
    log.setAction(action);
    log.setComment(comment);
    reviewLogRepository.save(log);
  }
}
