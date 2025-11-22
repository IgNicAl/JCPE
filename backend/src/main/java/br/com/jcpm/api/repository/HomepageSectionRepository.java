package br.com.jcpm.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.HomepageSection;

/**
 * Repository para operações de banco de dados relacionadas a HomepageSection.
 */
@Repository
public interface HomepageSectionRepository extends JpaRepository<HomepageSection, UUID> {

  Optional<HomepageSection> findBySlug(String slug);

  List<HomepageSection> findByActiveTrue();
}
