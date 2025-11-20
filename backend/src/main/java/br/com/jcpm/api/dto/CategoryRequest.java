package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

  @NotBlank(message = "Nome da categoria não pode ser vazio")
  @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
  private String name;

  @Size(max = 512, message = "Descrição deve ter no máximo 512 caracteres")
  private String description;

  @Size(min = 7, max = 7, message = "Cor deve ser em formato hexadecimal (#RRGGBB)")
  private String color;
}
