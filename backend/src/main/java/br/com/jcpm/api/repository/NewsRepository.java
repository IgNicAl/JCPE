package br.com.jcpm.api.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.News;
import br.com.jcpm.api.domain.enums.NewsStatus;

@Repository
public interface NewsRepository extends JpaRepository<News, UUID> {
  List<News> findByAuthorId(UUID authorId);

  Optional<News> findBySlug(String slug);

  boolean existsBySlug(String slug);

  List<News> findAllByStatusOrderByPublicationDateDesc(NewsStatus status);

  // Busca paginada por página e status, ordenada por prioridade e data de
  // publicação (desc)
  List<News> findAllByPageAndStatusOrderByPriorityDescPublicationDateDesc(String page, NewsStatus status);

  // Busca notícias em destaque na HOME (página principal)
  List<News> findAllByIsFeaturedHomeAndStatusOrderByPriorityDescPublicationDateDesc(Boolean isFeaturedHome, NewsStatus status);

  // Busca notícias em destaque na página específica
  List<News> findAllByPageAndIsFeaturedPageAndStatusOrderByPriorityDescPublicationDateDesc(String page, Boolean isFeaturedPage, NewsStatus status);

  long countByAuthorId(UUID authorId);

  List<News> findTop3ByStatusOrderByPublicationDateDesc(NewsStatus status);

  // Queries para workflow de revisão
  List<News> findByStatus(NewsStatus status);

  List<News> findByStatusOrderByPublicationDateDesc(NewsStatus status, Pageable pageable);

  List<News> findByStatusInAndReviewedAtAfter(List<NewsStatus> statuses, LocalDateTime date, Pageable pageable);

  List<News> findByStatusAndAuthorId(NewsStatus status, UUID authorId);
}
