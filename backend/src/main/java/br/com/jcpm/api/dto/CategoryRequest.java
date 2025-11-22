package br.com.jcpm.api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

  @NotBlank(message = "Nome da categoria não pode ser vazio")
  @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
  private String name;

  private String slug; // Opcional, auto-gerado se vazio

  @Size(max = 512, message = "Descrição deve ter no máximo 512 caracteres")
  private String description;

  @Size(min = 7, max = 7, message = "Cor deve ser em formato hexadecimal (#RRGGBB)")
  private String color;

  private String icon; // Nome do ícone ou URL

  private UUID parentCategoryId; // Null para categoria raiz

  private Boolean active = true;

  private Integer displayOrder = 0;
}
