package br.com.jcpm.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.NewsReviewLog;

/**
 * Repository para operações de banco de dados relacionadas a NewsReviewLog.
 */
@Repository
public interface NewsReviewLogRepository extends JpaRepository<NewsReviewLog, UUID> {

  List<NewsReviewLog> findByNewsIdOrderByTimestampDesc(UUID newsId);

  List<NewsReviewLog> findByReviewerId(UUID reviewerId);
}
