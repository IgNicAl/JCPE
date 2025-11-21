package br.com.jcpm.api.domain.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa a relação de curtida entre um usuário e uma notícia.
 * Usa chave composta (userId + newsId) para garantir unicidade.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news_likes")
@IdClass(NewsLike.NewsLikeId.class)
public class NewsLike {

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

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime likedAt;

  /**
   * Classe auxiliar para chave composta
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class NewsLikeId implements Serializable {
    private UUID userId;
    private UUID newsId;
  }
}
