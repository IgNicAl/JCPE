package br.com.jcpm.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.jcpm.api.domain.entity.NewsLike;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para retornar uma notícia curtida com informações completas
 */
@Getter
@Setter
@NoArgsConstructor
public class NewsLikeResponse {

  // Informações da notícia
  private UUID id;
  private String title;
  private String slug;
  private String summary;
  private String featuredImageUrl;
  private LocalDateTime publicationDate;

  // Informações do autor
  private String authorName;
  private String authorUsername;
  private String authorProfileImageUrl;

  // Data em que foi curtida
  private LocalDateTime likedAt;

  public NewsLikeResponse(NewsLike newsLike) {
    this.id = newsLike.getNews().getId();
    this.title = newsLike.getNews().getTitle();
    this.slug = newsLike.getNews().getSlug();
    this.summary = newsLike.getNews().getSummary();
    this.featuredImageUrl = newsLike.getNews().getFeaturedImageUrl();
    this.publicationDate = newsLike.getNews().getPublicationDate();

    // Informações do autor
    this.authorName = newsLike.getNews().getAuthor().getName();
    this.authorUsername = newsLike.getNews().getAuthor().getUsername();
    this.authorProfileImageUrl = newsLike.getNews().getAuthor().getProfileImageUrl();

    // Data do like
    this.likedAt = newsLike.getLikedAt();
  }
}
