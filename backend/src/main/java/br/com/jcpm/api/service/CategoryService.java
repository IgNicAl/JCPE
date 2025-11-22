package br.com.jcpm.api.service;

import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.jcpm.api.domain.entity.Category;
import br.com.jcpm.api.dto.CategoryRequest;
import br.com.jcpm.api.dto.CategoryResponse;
import br.com.jcpm.api.repository.CategoryRepository;

/**
 * Service para gerenciamento de categorias.
 * Apenas ADMIN e REVIEWER podem criar/editar categorias.
 */
@Service
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  /**
   * Gera slug a partir do nome da categoria.
   */
  private String generateSlug(String name) {
    String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    String slug = pattern.matcher(normalized).replaceAll("");
    slug = slug.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", "");

    int count = 1;
    String finalSlug = slug;
    while (categoryRepository.existsBySlug(finalSlug)) {
      finalSlug = slug + "-" + count++;
    }
    return finalSlug;
  }

  /**
   * Criar nova categoria.
   */
  @Transactional
  public CategoryResponse createCategory(CategoryRequest request) {
    // Validar se nome já existe
    if (categoryRepository.existsByName(request.getName())) {
      throw new IllegalArgumentException("Categoria com este nome já existe");
    }

    Category category = new Category();
    category.setName(request.getName());
    category.setSlug(request.getSlug() != null && !request.getSlug().isBlank()
        ? request.getSlug()
        : generateSlug(request.getName()));
    category.setDescription(request.getDescription());
    category.setColor(request.getColor());
    category.setIcon(request.getIcon());
    category.setActive(request.getActive() != null ? request.getActive() : true);
    category.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

    // Se tiver categoria pai, buscar e vincular
    if (request.getParentCategoryId() != null) {
      Category parent = categoryRepository.findById(request.getParentCategoryId())
          .orElseThrow(() -> new IllegalArgumentException("Categoria pai não encontrada"));
      category.setParentCategory(parent);
    }

    Category saved = categoryRepository.save(category);
    return CategoryResponse.fromEntity(saved);
  }

  /**
   * Atualizar categoria existente.
   */
  @Transactional
  public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

    // Validar se novo nome já existe (exceto se for o mesmo nome)
    if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
      throw new IllegalArgumentException("Categoria com este nome já existe");
    }

    category.setName(request.getName());
    if (request.getSlug() != null && !request.getSlug().isBlank()) {
      category.setSlug(request.getSlug());
    }
    category.setDescription(request.getDescription());
    category.setColor(request.getColor());
    category.setIcon(request.getIcon());
    category.setActive(request.getActive() != null ? request.getActive() : category.getActive());
    category.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : category.getDisplayOrder());

    // Atualizar categoria pai
    if (request.getParentCategoryId() != null) {
      // Validar que não está criando loop (categoria não pode ser pai de si mesma)
      if (request.getParentCategoryId().equals(id)) {
        throw new IllegalArgumentException("Categoria não pode ser pai de si mesma");
      }
      Category parent = categoryRepository.findById(request.getParentCategoryId())
          .orElseThrow(() -> new IllegalArgumentException("Categoria pai não encontrada"));
      category.setParentCategory(parent);
    } else {
      category.setParentCategory(null);
    }

    Category updated = categoryRepository.save(category);
    return CategoryResponse.fromEntity(updated);
  }

  /**
   * Deletar categoria.
   * Apenas se não tiver subcategorias ou notícias vinculadas.
   */
  @Transactional
  public void deleteCategory(UUID id) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

    // Verificar se tem subcategorias
    List<Category> subcategories = categoryRepository.findByParentCategoryId(id);
    if (!subcategories.isEmpty()) {
      throw new IllegalStateException("Não é possível deletar categoria que possui subcategorias");
    }

    // TODO: Verificar se tem notícias vinculadas (quando NewsService estiver implementado)

    categoryRepository.delete(category);
  }

  /**
   * Buscar categoria por ID.
   */
  public CategoryResponse getCategoryById(UUID id) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    return CategoryResponse.fromEntity(category);
  }

  /**
   * Buscar categoria por slug.
   */
  public CategoryResponse getCategoryBySlug(String slug) {
    Category category = categoryRepository.findBySlug(slug)
        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    return CategoryResponse.fromEntity(category);
  }

  /**
   * Listar todas as categorias.
   */
  public List<CategoryResponse> getAllCategories() {
    return categoryRepository.findAll().stream()
        .map(CategoryResponse::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Listar apenas categorias ativas.
   */
  public List<CategoryResponse> getActiveCategories() {
    return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
        .map(CategoryResponse::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Listar categorias raiz (sem pai).
   */
  public List<CategoryResponse> getRootCategories() {
    return categoryRepository.findByParentCategoryIsNull().stream()
        .map(CategoryResponse::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Listar subcategorias de uma categoria.
   */
  public List<CategoryResponse> getSubcategories(UUID parentId) {
    return categoryRepository.findByParentCategoryId(parentId).stream()
        .map(CategoryResponse::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Toggle status ativo/inativo.
   */
  @Transactional
  public CategoryResponse toggleActive(UUID id) {
    Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    category.setActive(!category.getActive());
    Category updated = categoryRepository.save(category);
    return CategoryResponse.fromEntity(updated);
  }
}
