package br.com.jcpm.api.repository;

import java.util.List;
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

  List<Category> findByActiveTrue();
  List<Category> findByParentCategoryIsNull();
  List<Category> findByParentCategoryId(UUID parentId);
  List<Category> findByActiveTrueOrderByDisplayOrderAsc();
}
