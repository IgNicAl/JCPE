package br.com.jcpm.api.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.api.domain.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
  Optional<Category> findBySlug(String slug);
  Optional<Category> findByName(String name);
  boolean existsBySlug(String slug);
  boolean existsByName(String name);
}
