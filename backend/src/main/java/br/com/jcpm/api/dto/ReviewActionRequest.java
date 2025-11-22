package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.com.jcpm.api.domain.enums.NewsPriority;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de ação de revisão (aprovar, agendar).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewActionRequest {

  @NotNull(message = "Categoria é obrigatória")
  private UUID categoryId;

  private UUID subcategoryId; // Opcional

  @NotNull(message = "Prioridade é obrigatória")
  private NewsPriority priority;

  private List<UUID> homepageSectionIds; // Seções onde a notícia será destacada

  private List<String> tags; // Tags da notícia

  private String seoTitle; // Título SEO (opcional)

  private String seoMetaDescription; // Meta description SEO (opcional)

  private LocalDateTime scheduledPublishDate; // Data de agendamento (opcional)

  private String comment; // Comentário (obrigatório para rejeição, opcional para aprovação)
}
