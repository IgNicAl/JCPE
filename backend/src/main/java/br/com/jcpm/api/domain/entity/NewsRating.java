package br.com.jcpm.api.domain.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa a avaliação (rating) de uma notícia por um usuário.
 * Usa chave composta (userId + newsId) para garantir que cada usuário
 * só possa avaliar uma notícia uma vez.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news_ratings")
@IdClass(NewsRating.NewsRatingId.class)
public class NewsRating {

  @Id
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(name = "user_id", columnDefinition = "CHAR(36)")
  private UUID userId;

  @Id
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(name = "news_id", columnDefinition = "CHAR(36)")
  private UUID newsId;

  @ManyToOne
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "news_id", insertable = false, updatable = false)
  private News news;

  @Min(1)
  @Max(5)
  @Column(nullable = false)
  private Integer rating;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime ratedAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private LocalDateTime updatedAt;

  /**
   * Classe auxiliar para chave composta
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class NewsRatingId implements Serializable {
    private UUID userId;
    private UUID newsId;
  }
}
