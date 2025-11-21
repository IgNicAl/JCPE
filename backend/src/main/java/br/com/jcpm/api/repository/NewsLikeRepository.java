package br.com.jcpm.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.com.jcpm.api.domain.entity.NewsLike;

/**
 * Repositório para gerenciar likes de notícias
 */
@Repository
public interface NewsLikeRepository extends JpaRepository<NewsLike, NewsLike.NewsLikeId> {

  /**
   * Busca um like específico de um usuário em uma notícia
   */
  Optional<NewsLike> findByUserIdAndNewsId(UUID userId, UUID newsId);

  /**
   * Busca todos os likes de um usuário
   */
  List<NewsLike> findAllByUserId(UUID userId);

  /**
   * Busca todos os likes de um usuário ordenados por data (mais recentes primeiro)
   */
  List<NewsLike> findAllByUserIdOrderByLikedAtDesc(UUID userId);

  /**
   * Verifica se um usuário curtiu uma notícia específica
   */
  boolean existsByUserIdAndNewsId(UUID userId, UUID newsId);

  /**
   * Remove um like específico
   */
  @Modifying
  @Transactional
  void deleteByUserIdAndNewsId(UUID userId, UUID newsId);

  /**
   * Conta quantos likes uma notícia tem
   */
  long countByNewsId(UUID newsId);
}
