package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de categoria.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

  private UUID id;
  private String name;
  private String slug;
  private String description;
  private String color;
  private String icon;
  private UUID parentCategoryId;
  private String parentCategoryName;
  private Boolean active;
  private Integer displayOrder;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private List<CategoryResponse> subcategories; // Para exibir hierarquia

  /**
   * Converte uma entidade Category em CategoryResponse.
   */
  public static CategoryResponse fromEntity(Category category) {
    if (category == null) {
      return null;
    }

    CategoryResponse response = new CategoryResponse();
    response.setId(category.getId());
    response.setName(category.getName());
    response.setSlug(category.getSlug());
    response.setDescription(category.getDescription());
    response.setColor(category.getColor());
    response.setIcon(category.getIcon());
    response.setActive(category.getActive());
    response.setDisplayOrder(category.getDisplayOrder());
    response.setCreatedAt(category.getCreatedAt());
    response.setUpdatedAt(category.getUpdatedAt());

    if (category.getParentCategory() != null) {
      response.setParentCategoryId(category.getParentCategory().getId());
      response.setParentCategoryName(category.getParentCategory().getName());
    }

    return response;
  }
}
