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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa um Anúncio no sistema.
 * Anúncios podem ser exibidos em diferentes localizações do site.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "advertisements")
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotBlank(message = "Título é obrigatório")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "URL da imagem é obrigatória")
    @Column(name = "image_url", nullable = false, length = 512)
    private String imageUrl;

    @NotBlank(message = "URL de destino é obrigatória")
    @Column(name = "link_url", nullable = false, length = 512)
    private String linkUrl;

    @NotNull(message = "Largura é obrigatória")
    @Min(value = 1, message = "Largura deve ser maior que 0")
    @Column(nullable = false)
    private Integer width;

    @NotNull(message = "Altura é obrigatória")
    @Min(value = 1, message = "Altura deve ser maior que 0")
    @Column(nullable = false)
    private Integer height;

    @NotBlank(message = "Localização é obrigatória")
    @Column(nullable = false, length = 20)
    private String location; // 'id' ou 'class'

    @NotNull(message = "Status ativo é obrigatório")
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "click_count", nullable = false)
    private Integer clickCount = 0;

    @Column(name = "impression_count", nullable = false)
    private Integer impressionCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
