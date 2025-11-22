package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.HomepageSection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para seção da homepage.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomepageSectionDTO {

  private UUID id;
  private String name;
  private String slug;
  private String description;
  private Boolean active;
  private LocalDateTime createdAt;

  /**
   * Converte entidade HomepageSection para DTO.
   */
  public static HomepageSectionDTO fromEntity(HomepageSection section) {
    if (section == null) {
      return null;
    }

    HomepageSectionDTO dto = new HomepageSectionDTO();
    dto.setId(section.getId());
    dto.setName(section.getName());
    dto.setSlug(section.getSlug());
    dto.setDescription(section.getDescription());
    dto.setActive(section.getActive());
    dto.setCreatedAt(section.getCreatedAt());

    return dto;
  }
}
