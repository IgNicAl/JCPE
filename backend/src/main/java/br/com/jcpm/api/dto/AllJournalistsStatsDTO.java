package br.com.jcpm.api.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estatísticas globais de todos os jornalistas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllJournalistsStatsDTO {
  private Integer totalJournalists;
  private Long totalNewsPublished;
  private Long totalPlatformViews;
  private List<JournalistStatsDTO> journalists;
}
