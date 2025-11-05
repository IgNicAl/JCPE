package br.com.jcpe.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpe.api.domain.entity.News;

@Repository
public interface NewsRepository extends JpaRepository<News, UUID> {
  List<News> findByAuthorId(UUID authorId);

  Optional<News> findBySlug(String slug);

  boolean existsBySlug(String slug);

  List<News> findAllByStatusOrderByPublicationDateDesc(String status);

  // Busca paginada por página e status, ordenada por prioridade e data de
  // publicação (desc)
  List<News> findAllByPageAndStatusOrderByPriorityDescPublicationDateDesc(String page, String status);
}
