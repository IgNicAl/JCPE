package br.com.jcpm.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para receber requisição de avaliação (rating)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsRatingRequest {

  @NotNull(message = "A avaliação não pode ser nula")
  @Min(value = 1, message = "A avaliação mínima é 1")
  @Max(value = 5, message = "A avaliação máxima é 5")
  private Integer rating;
}
