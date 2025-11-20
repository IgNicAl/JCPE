package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TagRequest {

  @NotBlank(message = "Nome da tag não pode ser vazio")
  @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
  private String name;
}
