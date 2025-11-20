package br.com.jcpm.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.NewsRating;

@Repository
public interface NewsRatingRepository extends JpaRepository<NewsRating, NewsRating.NewsRatingId> {

  /**
   * Verifica se um usuário já avaliou uma notícia
   */
  boolean existsByUserIdAndNewsId(UUID userId, UUID newsId);

  /**
   * Busca a avaliação de um usuário para uma notícia específica
   */
  Optional<NewsRating> findByUserIdAndNewsId(UUID userId, UUID newsId);

  /**
   * Busca todas as avaliações de uma notícia
   */
  List<NewsRating> findAllByNewsId(UUID newsId);

  /**
   * Calcula a média de avaliações de uma notícia
   */
  @Query("SELECT AVG(r.rating) FROM NewsRating r WHERE r.newsId = :newsId")
  Double getAverageRatingByNewsId(@Param("newsId") UUID newsId);

  /**
   * Conta o total de avaliações de uma notícia
   */
  long countByNewsId(UUID newsId);

  /**
   * Deleta a avaliação de um usuário para uma notícia
   */
  void deleteByUserIdAndNewsId(UUID userId, UUID newsId);
}
