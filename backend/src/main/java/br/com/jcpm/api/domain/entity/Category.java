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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa uma categoria de notícia (apenas ADMINs podem criar/editar).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categorias")
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @NotBlank(message = "Nome da categoria é obrigatório")
  @Column(nullable = false, unique = true)
  private String name;

  @NotBlank(message = "Slug é obrigatório")
  @Column(nullable = false, unique = true)
  private String slug;

  @Column(length = 512)
  private String description;

  @Column(length = 7) // cor em hexadecimal ex: #FF5733
  private String color;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
