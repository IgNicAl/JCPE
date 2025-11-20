package br.com.jcpm.api.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.domain.entity.Category;
import br.com.jcpm.api.dto.CategoryRequest;
import br.com.jcpm.api.dto.CategoryResponse;
import br.com.jcpm.api.repository.CategoryRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  @Autowired
  private CategoryRepository categoryRepository;

  /**
   * Listar todas as categorias (público)
   */
  @GetMapping
  public ResponseEntity<List<CategoryResponse>> listAll() {
    List<CategoryResponse> categories = categoryRepository.findAll()
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
    return ResponseEntity.ok(categories);
  }

  /**
   * Buscar categoria por ID (público)
   */
  @GetMapping("/{id}")
  public ResponseEntity<CategoryResponse> getById(@PathVariable UUID id) {
    return categoryRepository.findById(id)
      .map(category -> ResponseEntity.ok(toResponse(category)))
      .orElse(ResponseEntity.notFound().build());
  }

  /**
   * Criar nova categoria (apenas ADMIN)
   */
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
    // Verificar se já existe categoria com o mesmo nome
    if (categoryRepository.existsByName(request.getName())) {
      return ResponseEntity.badRequest().build();
    }

    Category category = new Category();
    category.setName(request.getName());
    category.setSlug(generateSlug(request.getName()));
    category.setDescription(request.getDescription());
    category.setColor(request.getColor());

    Category saved = categoryRepository.save(category);
    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
  }

  /**
   * Atualizar categoria (apenas ADMIN)
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<CategoryResponse> update(@PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
    return categoryRepository.findById(id)
      .map(category -> {
        category.setName(request.getName());
        category.setSlug(generateSlug(request.getName()));
        category.setDescription(request.getDescription());
        category.setColor(request.getColor());
        Category updated = categoryRepository.save(category);
        return ResponseEntity.ok(toResponse(updated));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  /**
   * Deletar categoria (apenas ADMIN)
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    if (!categoryRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    categoryRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // Métodos auxiliares
  private CategoryResponse toResponse(Category category) {
    return new CategoryResponse(
      category.getId(),
      category.getName(),
      category.getSlug(),
      category.getDescription(),
      category.getColor(),
      category.getCreatedAt(),
      category.getUpdatedAt()
    );
  }

  private String generateSlug(String name) {
    return name.toLowerCase()
      .replaceAll("[àáâãäå]", "a")
      .replaceAll("[èéêë]", "e")
      .replaceAll("[ìíîï]", "i")
      .replaceAll("[òóôõö]", "o")
      .replaceAll("[ùúûü]", "u")
      .replaceAll("[ç]", "c")
      .replaceAll("[^a-z0-9\\s-]", "")
      .replaceAll("\\s+", "-")
      .replaceAll("-+", "-")
      .trim();
  }
}
