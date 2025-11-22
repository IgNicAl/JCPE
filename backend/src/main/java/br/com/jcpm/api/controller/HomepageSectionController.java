package br.com.jcpm.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.dto.HomepageSectionDTO;
import br.com.jcpm.api.service.HomepageSectionService;

/**
 * Controller para seções da homepage.
 * Endpoints públicos (read-only).
 */
@RestController
@RequestMapping("/api/homepage-sections")
public class HomepageSectionController {

  private final HomepageSectionService homepageSectionService;

  public HomepageSectionController(HomepageSectionService homepageSectionService) {
    this.homepageSectionService = homepageSectionService;
  }

  /**
   * Listar todas as seções.
   */
  @GetMapping
  public ResponseEntity<List<HomepageSectionDTO>> getAllSections() {
    return ResponseEntity.ok(homepageSectionService.getAllSections());
  }

  /**
   * Listar apenas seções ativas.
   */
  @GetMapping("/active")
  public ResponseEntity<List<HomepageSectionDTO>> getActiveSections() {
    return ResponseEntity.ok(homepageSectionService.getActiveSections());
  }

  /**
   * Buscar seção por ID.
   */
  @GetMapping("/{id}")
  public ResponseEntity<HomepageSectionDTO> getSectionById(@PathVariable UUID id) {
    try {
      return ResponseEntity.ok(homepageSectionService.getSectionById(id));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * Buscar seção por slug.
   */
  @GetMapping("/slug/{slug}")
  public ResponseEntity<HomepageSectionDTO> getSectionBySlug(@PathVariable String slug) {
    try {
      return ResponseEntity.ok(homepageSectionService.getSectionBySlug(slug));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
