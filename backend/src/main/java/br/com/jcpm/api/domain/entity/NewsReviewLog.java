package br.com.jcpm.api.domain.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa o log de auditoria de revisões de notícias.
 * Registra todas as ações de aprovação, rejeição e solicitação de mudanças.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news_review_logs")
public class NewsReviewLog {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @NotNull
  @ManyToOne
  @JoinColumn(name = "news_id", nullable = false)
  private News news;

  @NotNull
  @ManyToOne
  @JoinColumn(name = "reviewer_id", nullable = false)
  private User reviewer;

  @NotBlank(message = "Ação é obrigatória")
  @Column(nullable = false, length = 50)
  private String action; // APPROVED, REJECTED, REQUESTED_CHANGES

  @Column(columnDefinition = "TEXT")
  private String comment;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime timestamp;
}
