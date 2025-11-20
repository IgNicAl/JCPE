package br.com.jcpm.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.NewsShare;

@Repository
public interface NewsShareRepository extends JpaRepository<NewsShare, UUID> {

  /**
   * Conta o total de compartilhamentos de uma notícia
   */
  long countByNewsId(UUID newsId);

  /**
   * Conta quantas vezes um usuário compartilhou uma notícia específica
   */
  long countByUserIdAndNewsId(UUID userId, UUID newsId);
}
