package br.com.jcpm.api.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estatísticas de um jornalista individual
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalistStatsDTO {
  private UUID userId;
  private String journalistName;
  private Long totalNews;
  private Long totalViews;
  private Long totalLikes;
  private Long totalComments;
  private Long totalShares;
  private Double averageRating;
  private List<TopNewsDTO> topNews;
  private Map<String, Long> viewsByMonth;
}
