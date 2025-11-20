package br.com.jcpm.api.domain.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa um comentário em uma notícia.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news_comments")
public class NewsComment {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(name = "news_id", nullable = false, columnDefinition = "CHAR(36)")
  private UUID newsId;

  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(name = "user_id", nullable = false, columnDefinition = "CHAR(36)")
  private UUID userId;

  @ManyToOne
  @JoinColumn(name = "news_id", insertable = false, updatable = false)
  private News news;

  @ManyToOne
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private User user;

  @NotBlank(message = "O conteúdo do comentário não pode estar vazio")
  @Size(max = 1000, message = "O comentário não pode ter mais de 1000 caracteres")
  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private LocalDateTime updatedAt;
}
