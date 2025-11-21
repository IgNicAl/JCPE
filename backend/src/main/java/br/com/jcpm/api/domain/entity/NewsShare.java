package br.com.jcpm.api.domain.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa um compartilhamento de notícia por um usuário.
 * Usado para rastrear quantas vezes uma notícia foi compartilhada.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news_shares")
public class NewsShare {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(name = "news_id", nullable = false, columnDefinition = "CHAR(36)")
  private UUID newsId;

  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(name = "user_id", columnDefinition = "CHAR(36)")
  private UUID userId;

  @ManyToOne
  @JoinColumn(name = "news_id", insertable = false, updatable = false)
  private News news;

  @ManyToOne
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private User user;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime sharedAt;
}
