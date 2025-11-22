package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.NewsReviewLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de log de revisão.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsReviewLogResponse {

  private UUID id;
  private UUID newsId;
  private String newsTitle;
  private UserInfo reviewer;
  private String action; // APPROVED, REJECTED, REQUESTED_CHANGES
  private String comment;
  private LocalDateTime timestamp;

  /**
   * Classe interna para informações do revisor.
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserInfo {
    private UUID id;
    private String name;
    private String username;
    private String profileImageUrl;
  }

  /**
   * Converte entidade NewsReviewLog para NewsReviewLogResponse.
   */
  public static NewsReviewLogResponse fromEntity(NewsReviewLog log) {
    if (log == null) {
      return null;
    }

    NewsReviewLogResponse response = new NewsReviewLogResponse();
    response.setId(log.getId());
    response.setNewsId(log.getNews().getId());
    response.setNewsTitle(log.getNews().getTitle());
    response.setAction(log.getAction());
    response.setComment(log.getComment());
    response.setTimestamp(log.getTimestamp());

    if (log.getReviewer() != null) {
      UserInfo reviewerInfo = new UserInfo();
      reviewerInfo.setId(log.getReviewer().getId());
      reviewerInfo.setName(log.getReviewer().getName());
      reviewerInfo.setUsername(log.getReviewer().getUsername());
      reviewerInfo.setProfileImageUrl(log.getReviewer().getProfileImageUrl());
      response.setReviewer(reviewerInfo);
    }

    return response;
  }
}
