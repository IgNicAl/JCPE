package br.com.jcpm.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.NewsView;

/**
 * Repository para gerenciar visualizações de notícias
 */
@Repository
public interface NewsViewRepository extends JpaRepository<NewsView, UUID> {

  /**
   * Conta o número total de visualizações de uma notícia
   */
  long countByNewsId(UUID newsId);

  /**
   * Verifica se um usuário já visualizou uma notícia
   */
  boolean existsByNewsIdAndUserId(UUID newsId, UUID userId);

  /**
   * Verifica se uma sessão já visualizou uma notícia (para usuários não autenticados)
   */
  boolean existsByNewsIdAndSessionId(UUID newsId, String sessionId);
}
