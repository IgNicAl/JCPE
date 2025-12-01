package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.Category;
import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.entity.Tag;
import br.com.jcpm.api.domain.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para retornar notícias com métricas calculadas (averageRating, readCount)
 */
@Data
@NoArgsConstructor
public class NewsWithMetricsDTO {
  private UUID id;
  private User author;
  private String title;
  private String slug;
  private String summary;
  private String content;
  private String contentJson;
  private String featuredImageUrl;
  private String mediaType;
  private String mediaSource;
  private Integer priority;
  private String page;
  private Boolean isFeaturedHome;
  private Boolean isFeaturedPage;
  private Category category;
  private Set<Tag> tags;
  private LocalDateTime publicationDate;
  private LocalDateTime updateDate;
  private Long readCount; // Contador de visualizações
  private Double averageRating; // Avaliação média calculada
  private Long totalRatings; // Total de avaliações

  /**
   * Construtor que converte News para DTO com métricas
   */
  public NewsWithMetricsDTO(News news, Double averageRating, Long totalRatings) {
    this.id = news.getId();
    this.author = news.getAuthor();
    this.title = news.getTitle();
    this.slug = news.getSlug();
    this.summary = news.getSummary();
    this.content = news.getContent();
    this.contentJson = news.getContentJson();
    this.featuredImageUrl = news.getFeaturedImageUrl();
    this.mediaType = news.getMediaType();
    this.mediaSource = news.getMediaSource();
    this.priority = news.getPriority();
    this.page = news.getPage();
    this.isFeaturedHome = news.getIsFeaturedHome();
    this.isFeaturedPage = news.getIsFeaturedPage();
    this.category = news.getCategory();
    this.tags = news.getTags();
    this.publicationDate = news.getPublicationDate();
    this.updateDate = news.getUpdateDate();
    this.readCount = news.getReadCount() != null ? news.getReadCount() : 0L;
    this.averageRating = averageRating != null ? averageRating : 0.0;
    this.totalRatings = totalRatings != null ? totalRatings : 0L;
  }
}
