package br.com.jcpm.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para receber estatísticas gerais de uma notícia
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsStatsResponse {
  private long likesCount;
  private long sharesCount;
  private long commentsCount;
  private double averageRating;
  private long totalRatings;
  private boolean userHasLiked;
  private Integer userRating;
}
