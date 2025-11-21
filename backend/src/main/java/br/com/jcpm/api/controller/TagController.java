package br.com.jcpm.api.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.domain.entity.Tag;
import br.com.jcpm.api.domain.entity.User;
import br.com.jcpm.api.dto.TagRequest;
import br.com.jcpm.api.dto.TagResponse;
import br.com.jcpm.api.repository.TagRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tags")
public class TagController {

  @Autowired
  private TagRepository tagRepository;

  /**
   * Listar todas as tags (público)
   */
  @GetMapping
  public ResponseEntity<List<TagResponse>> listAll() {
    List<TagResponse> tags = tagRepository.findAll()
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
    return ResponseEntity.ok(tags);
  }

  /**
   * Buscar tags por nome (autocomplete)
   */
  @GetMapping("/search")
  public ResponseEntity<List<TagResponse>> searchByName(@RequestParam String query) {
    List<TagResponse> tags = tagRepository.findByNameContainingIgnoreCase(query)
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
    return ResponseEntity.ok(tags);
  }

  /**
   * Buscar tag por ID (público)
   */
  @GetMapping("/{id}")
  public ResponseEntity<TagResponse> getById(@PathVariable UUID id) {
    return tagRepository.findById(id)
      .map(tag -> ResponseEntity.ok(toResponse(tag)))
      .orElse(ResponseEntity.notFound().build());
  }

  /**
   * Criar nova tag (JOURNALIST ou ADMIN)
   */
  @PostMapping
  @PreAuthorize("hasRole('JOURNALIST') or hasRole('ADMIN')")
  public ResponseEntity<TagResponse> create(@Valid @RequestBody TagRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    // Verificar se já existe tag com o mesmo nome
    if (tagRepository.existsByName(request.getName())) {
      return ResponseEntity.badRequest().build();
    }

    Tag tag = new Tag();
    tag.setName(request.getName());
    tag.setSlug(generateSlug(request.getName()));
    tag.setCreatedBy(currentUser);

    Tag saved = tagRepository.save(tag);
    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
  }

  /**
   * Deletar tag (apenas ADMIN)
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    if (!tagRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    tagRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // Métodos auxiliares
  private TagResponse toResponse(Tag tag) {
    return new TagResponse(
      tag.getId(),
      tag.getName(),
      tag.getSlug(),
      tag.getCreatedBy() != null ? tag.getCreatedBy().getName() : null,
      tag.getCreatedAt()
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
