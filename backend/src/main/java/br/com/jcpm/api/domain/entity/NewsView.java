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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa uma visualização de notícia.
 * Permite rastrear visualizações únicas por usuário ou por sessão.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news_views")
public class NewsView {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "news_id", nullable = false)
  private News news;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = true)
  private User user;

  @Column(nullable = true, length = 255)
  private String sessionId; // Para visitantes não autenticados

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime viewedAt;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public News getNews() {
    return news;
  }

  public void setNews(News news) {
    this.news = news;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  public LocalDateTime getViewedAt() {
    return viewedAt;
  }

  public void setViewedAt(LocalDateTime viewedAt) {
    this.viewedAt = viewedAt;
  }
}
