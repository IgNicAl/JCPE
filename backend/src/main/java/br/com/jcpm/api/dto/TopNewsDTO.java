package br.com.jcpm.api.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para notícia com métricas de engajamento
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopNewsDTO {
  private UUID newsId;
  private String title;
  private String slug;
  private Long views;
  private Long likes;
  private Long comments;
  private Long shares;
  private Double averageRating;
}
