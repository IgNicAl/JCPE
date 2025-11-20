package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.NewsComment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para retornar comentários com informações do usuário
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsCommentResponse {
  private UUID id;
  private UUID newsId;
  private UserInfo user;
  private String content;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserInfo {
    private UUID id;
    private String name;
    private String username;
    private String urlImagemPerfil;
  }

  private java.util.List<NewsCommentResponse> replies;

  public NewsCommentResponse(NewsComment comment) {
    this.id = comment.getId();
    this.newsId = comment.getNewsId();
    this.content = comment.getContent();
    this.createdAt = comment.getCreatedAt();
    this.updatedAt = comment.getUpdatedAt();

    if (comment.getUser() != null) {
      this.user = new UserInfo(
        comment.getUser().getId(),
        comment.getUser().getName(),
        comment.getUser().getUsername(),
        comment.getUser().getProfileImageUrl()
      );
    }

    if (comment.getReplies() != null) {
      this.replies = comment.getReplies().stream()
          .map(NewsCommentResponse::new)
          .collect(java.util.stream.Collectors.toList());
    }
  }
}
