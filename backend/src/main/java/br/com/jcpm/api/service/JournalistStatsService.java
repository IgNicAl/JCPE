package br.com.jcpm.api.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.domain.enums.NewsStatus;
import br.com.jcpm.api.domain.enums.UserType;
import br.com.jcpm.api.dto.AllJournalistsStatsDTO;
import br.com.jcpm.api.dto.JournalistStatsDTO;
import br.com.jcpm.api.dto.TopNewsDTO;
import br.com.jcpm.api.repository.NewsCommentRepository;
import br.com.jcpm.api.repository.NewsLikeRepository;
import br.com.jcpm.api.repository.NewsRatingRepository;
import br.com.jcpm.api.repository.NewsRepository;
import br.com.jcpm.api.repository.NewsShareRepository;
import br.com.jcpm.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;

/**
 * Service para calcular estatísticas de jornalistas
 */
@Service
@RequiredArgsConstructor
public class JournalistStatsService {

  private final NewsRepository newsRepository;
  private final NewsLikeRepository newsLikeRepository;
  private final NewsCommentRepository newsCommentRepository;
  private final NewsShareRepository newsShareRepository;
  private final NewsRatingRepository newsRatingRepository;
  private final UserRepository userRepository;

  /**
   * Obtém estatísticas do jornalista logado
   */
  public JournalistStatsDTO getMyStats() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    return getJournalistStats(user.getId());
  }

  /**
   * Obtém estatísticas de um jornalista específico
   */
  public JournalistStatsDTO getJournalistStats(UUID userId) {
    User journalist = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("Jornalista não encontrado"));

    // Buscar todas as notícias publicadas do jornalista
    List<News> publishedNews = newsRepository.findByStatusAndAuthorId(NewsStatus.PUBLISHED, userId);

    // Calcular métricas
    Long totalLikes = 0L;
    Long totalComments = 0L;
    Long totalShares = 0L;
    Double totalRatingSum = 0.0;
    Long totalRatingCount = 0L;

    List<TopNewsDTO> topNewsList = new ArrayList<>();

    for (News news : publishedNews) {
      Long likes = newsLikeRepository.countByNewsId(news.getId());
      Long comments = newsCommentRepository.countByNewsId(news.getId());
      Long shares = newsShareRepository.countByNewsId(news.getId());
      Double avgRating = newsRatingRepository.getAverageRatingByNewsId(news.getId());

      totalLikes += likes;
      totalComments += comments;
      totalShares += shares;

      if (avgRating != null) {
        totalRatingSum += avgRating;
        totalRatingCount++;
      }

      // Criar DTO para top news (sem views por enquanto, usaremos engajamento total)
      Long engagementScore = likes + comments + shares;
      topNewsList.add(new TopNewsDTO(
        news.getId(),
        news.getTitle(),
        news.getSlug(),
        0L, // views - TODO: implementar tracking de views
        likes,
        comments,
        shares,
        avgRating != null ? avgRating : 0.0
      ));
    }

    // Ordenar por engajamento e pegar top 5
    List<TopNewsDTO> top5News = topNewsList.stream()
      .sorted(Comparator.comparing((TopNewsDTO n) -> n.getLikes() + n.getComments() + n.getShares()).reversed())
      .limit(5)
      .collect(Collectors.toList());

    // Calcular views por mês (últimos 6 meses)
    Map<String, Long> viewsByMonth = calculateViewsByMonth(publishedNews);

    // Calcular média de rating
    Double averageRating = totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0.0;

    return new JournalistStatsDTO(
      journalist.getId(),
      journalist.getName(),
      (long) publishedNews.size(),
      0L, // totalViews - TODO: implementar tracking de views
      totalLikes,
      totalComments,
      totalShares,
      averageRating,
      top5News,
      viewsByMonth
    );
  }

  /**
   * Obtém estatísticas de todos os jornalistas (apenas para admin)
   */
  public AllJournalistsStatsDTO getAllJournalistsStats() {
    // Buscar todos os usuários do tipo JOURNALIST
    List<User> journalists = userRepository.findAll().stream()
      .filter(user -> user.getUserType() == UserType.JOURNALIST)
      .collect(Collectors.toList());

    List<JournalistStatsDTO> journalistStats = new ArrayList<>();
    Long totalNewsPublished = 0L;
    Long totalPlatformViews = 0L;

    for (User journalist : journalists) {
      JournalistStatsDTO stats = getJournalistStats(journalist.getId());
      journalistStats.add(stats);
      totalNewsPublished += stats.getTotalNews();
      totalPlatformViews += stats.getTotalViews();
    }

    // Ordenar por total de views (ou outro critério)
    journalistStats.sort(Comparator.comparing(JournalistStatsDTO::getTotalLikes).reversed());

    return new AllJournalistsStatsDTO(
      journalists.size(),
      totalNewsPublished,
      totalPlatformViews,
      journalistStats
    );
  }

  /**
   * Calcula views por mês para os últimos 6 meses
   * TODO: Implementar tracking real de views quando disponível
   */
  private Map<String, Long> calculateViewsByMonth(List<News> newsList) {
    Map<String, Long> viewsByMonth = new HashMap<>();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

    LocalDateTime now = LocalDateTime.now();

    // Inicializar últimos 6 meses com 0
    for (int i = 5; i >= 0; i--) {
      LocalDateTime monthDate = now.minusMonths(i);
      String monthKey = monthDate.format(formatter);
      viewsByMonth.put(monthKey, 0L);
    }

    // Por enquanto, apenas contar publicações por mês como placeholder
    for (News news : newsList) {
      if (news.getPublicationDate() != null) {
        String monthKey = news.getPublicationDate().format(formatter);
        if (viewsByMonth.containsKey(monthKey)) {
          viewsByMonth.put(monthKey, viewsByMonth.get(monthKey) + 1);
        }
      }
    }

    return viewsByMonth;
  }
}
