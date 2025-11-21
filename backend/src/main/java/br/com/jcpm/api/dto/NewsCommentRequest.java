package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para receber requisição de criação de comentário
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsCommentRequest {

  @NotBlank(message = "O conteúdo do comentário não pode estar vazio")
  @Size(max = 1000, message = "O comentário não pode ter mais de 1000 caracteres")
  private String content;

  private String parentId;
}
