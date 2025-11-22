package br.com.jcpm.api.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.com.jcpm.api.domain.entity.HomepageSection;
import br.com.jcpm.api.dto.HomepageSectionDTO;
import br.com.jcpm.api.repository.HomepageSectionRepository;

/**
 * Service para gerenciamento de seções da homepage.
 */
@Service
public class HomepageSectionService {

  private final HomepageSectionRepository homepageSectionRepository;

  public HomepageSectionService(HomepageSectionRepository homepageSectionRepository) {
    this.homepageSectionRepository = homepageSectionRepository;
  }

  /**
   * Listar todas as seções.
   */
  public List<HomepageSectionDTO> getAllSections() {
    return homepageSectionRepository.findAll().stream()
        .map(HomepageSectionDTO::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Listar apenas seções ativas.
   */
  public List<HomepageSectionDTO> getActiveSections() {
    return homepageSectionRepository.findByActiveTrue().stream()
        .map(HomepageSectionDTO::fromEntity)
        .collect(Collectors.toList());
  }

  /**
   * Buscar seção por ID.
   */
  public HomepageSectionDTO getSectionById(UUID id) {
    HomepageSection section = homepageSectionRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Seção não encontrada"));
    return HomepageSectionDTO.fromEntity(section);
  }

  /**
   * Buscar seção por slug.
   */
  public HomepageSectionDTO getSectionBySlug(String slug) {
    HomepageSection section = homepageSectionRepository.findBySlug(slug)
        .orElseThrow(() -> new IllegalArgumentException("Seção não encontrada"));
    return HomepageSectionDTO.fromEntity(section);
  }
}
