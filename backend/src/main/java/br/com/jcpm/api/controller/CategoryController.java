package br.com.jcpm.api.controller;

import java.util.List;
import java.util.UUID;

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

import br.com.jcpm.api.dto.CategoryRequest;
import br.com.jcpm.api.dto.CategoryResponse;
import br.com.jcpm.api.service.CategoryService;
import jakarta.validation.Valid;

/**
 * Controller para gerenciamento de categorias.
 * CRUD completo - Apenas ADMIN e REVIEWER podem criar/editar/deletar.
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  /**
   * Listar todas as categorias (público).
   */
  @GetMapping
  public ResponseEntity<List<CategoryResponse>> getAllCategories() {
    return ResponseEntity.ok(categoryService.getAllCategories());
  }

  /**
   * Listar apenas categorias ativas (público).
   */
  @GetMapping("/active")
  public ResponseEntity<List<CategoryResponse>> getActiveCategories() {
    return ResponseEntity.ok(categoryService.getActiveCategories());
  }

  /**
   * Listar categorias raiz (sem pai).
   */
  @GetMapping("/root")
  public ResponseEntity<List<CategoryResponse>> getRootCategories() {
    return ResponseEntity.ok(categoryService.getRootCategories());
  }

  /**
   * Buscar categoria por ID.
   */
  @GetMapping("/{id}")
  public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable UUID id) {
    try {
      return ResponseEntity.ok(categoryService.getCategoryById(id));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Buscar categoria por slug.
   */
  @GetMapping("/slug/{slug}")
  public ResponseEntity<CategoryResponse> getCategoryBySlug(@PathVariable String slug) {
    try {
      return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Listar subcategorias de uma categoria.
   */
  @GetMapping("/{id}/subcategories")
  public ResponseEntity<List<CategoryResponse>> getSubcategories(@PathVariable UUID id) {
    return ResponseEntity.ok(categoryService.getSubcategories(id));
  }

  /**
   * Criar nova categoria (ADMIN ou REVIEWER).
   */
  @PostMapping
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
    try {
      CategoryResponse created = categoryService.createCategory(request);
      return ResponseEntity.status(HttpStatus.CREATED).body(created);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * Atualizar categoria existente (ADMIN ou REVIEWER).
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<CategoryResponse> updateCategory(
      @PathVariable UUID id,
      @Valid @RequestBody CategoryRequest request) {
    try {
      CategoryResponse updated = categoryService.updateCategory(id, request);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Deletar categoria (apenas ADMIN).
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
    try {
      categoryService.deleteCategory(id);
      return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
  }

  /**
   * Toggle status ativo/inativo (ADMIN ou REVIEWER).
   */
  @PutMapping("/{id}/toggle-active")
  @PreAuthorize("hasRole('ADMIN') or hasRole('REVIEWER')")
  public ResponseEntity<CategoryResponse> toggleActive(@PathVariable UUID id) {
    try {
      CategoryResponse updated = categoryService.toggleActive(id);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
