package br.com.jcpm.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.NewsComment;

@Repository
public interface NewsCommentRepository extends JpaRepository<NewsComment, UUID> {

  /**
   * Busca todos os comentários de uma notícia, ordenados por data (mais recentes primeiro)
   */
  List<NewsComment> findAllByNewsIdOrderByCreatedAtDesc(UUID newsId);

  List<NewsComment> findAllByNewsIdAndParentIsNullOrderByCreatedAtDesc(UUID newsId);

  /**
   * Conta o total de comentários de uma notícia
   */
  long countByNewsId(UUID newsId);

  /**
   * Busca todos os comentários de um usuário
   */
  List<NewsComment> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

  /**
   * Deleta todos os comentários de uma notícia
   */
  void deleteAllByNewsId(UUID newsId);
}
