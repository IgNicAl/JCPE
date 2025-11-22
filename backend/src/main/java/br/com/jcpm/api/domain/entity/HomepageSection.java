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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa uma seção da homepage onde notícias podem ser exibidas.
 * Ex: Latest Videos, New Posts, Popular Posts, Featured, etc.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "homepage_sections")
public class HomepageSection {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @NotBlank(message = "Nome da seção é obrigatório")
  @Column(nullable = false, unique = true, length = 100)
  private String name;

  @NotBlank(message = "Slug é obrigatório")
  @Column(nullable = false, unique = true, length = 100)
  private String slug;

  @Column(length = 512)
  private String description;

  @Column(nullable = false)
  private Boolean active = true;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;
}
