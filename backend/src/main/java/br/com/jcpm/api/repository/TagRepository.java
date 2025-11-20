package br.com.jcpm.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
  Optional<Tag> findBySlug(String slug);
  Optional<Tag> findByName(String name);
  List<Tag> findByNameContainingIgnoreCase(String name);
  boolean existsBySlug(String slug);
  boolean existsByName(String name);
}
