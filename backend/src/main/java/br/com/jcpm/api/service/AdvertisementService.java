package br.com.jcpm.api.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.jcpm.api.domain.entity.Advertisement;
import br.com.jcpm.api.dto.AdvertisementRequest;
import br.com.jcpm.api.dto.AdvertisementResponse;
import br.com.jcpm.api.repository.AdvertisementRepository;

/**
 * Service para gerenciar lógica de negócio de anúncios.
 */
@Service
public class AdvertisementService {

    @Autowired
    private AdvertisementRepository advertisementRepository;

    /**
     * Lista todos os anúncios.
     */
    public List<AdvertisementResponse> findAll() {
        return advertisementRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lista apenas anúncios ativos.
     */
    public List<AdvertisementResponse> findActive() {
        return advertisementRepository.findByIsActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lista anúncios por localização.
     */
    public List<AdvertisementResponse> findByLocation(String location) {
        return advertisementRepository.findByLocation(location).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lista anúncios ativos por localização.
     */
    public List<AdvertisementResponse> findActiveByLocation(String location) {
        return advertisementRepository.findByIsActiveTrueAndLocation(location).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Busca anúncio por ID.
     */
    public AdvertisementResponse findById(UUID id) {
        Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anúncio não encontrado com ID: " + id));
        return toResponse(advertisement);
    }

    /**
     * Cria novo anúncio.
     */
    @Transactional
    public AdvertisementResponse create(AdvertisementRequest request) {
        Advertisement advertisement = new Advertisement();
        advertisement.setTitle(request.getTitle());
        advertisement.setImageUrl(request.getImageUrl());
        advertisement.setLinkUrl(request.getLinkUrl());
        advertisement.setWidth(request.getWidth());
        advertisement.setHeight(request.getHeight());
        advertisement.setLocation(request.getLocation());
        advertisement.setIsActive(request.getIsActive());
        advertisement.setStartDate(request.getStartDate());
        advertisement.setEndDate(request.getEndDate());
        advertisement.setClickCount(0);
        advertisement.setImpressionCount(0);

        Advertisement saved = advertisementRepository.save(advertisement);
        return toResponse(saved);
    }

    /**
     * Atualiza anúncio existente.
     */
    @Transactional
    public AdvertisementResponse update(UUID id, AdvertisementRequest request) {
        Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anúncio não encontrado com ID: " + id));

        advertisement.setTitle(request.getTitle());
        advertisement.setImageUrl(request.getImageUrl());
        advertisement.setLinkUrl(request.getLinkUrl());
        advertisement.setWidth(request.getWidth());
        advertisement.setHeight(request.getHeight());
        advertisement.setLocation(request.getLocation());
        advertisement.setIsActive(request.getIsActive());
        advertisement.setStartDate(request.getStartDate());
        advertisement.setEndDate(request.getEndDate());

        Advertisement updated = advertisementRepository.save(advertisement);
        return toResponse(updated);
    }

    /**
     * Deleta anúncio.
     */
    @Transactional
    public void delete(UUID id) {
        if (!advertisementRepository.existsById(id)) {
            throw new RuntimeException("Anúncio não encontrado com ID: " + id);
        }
        advertisementRepository.deleteById(id);
    }

    /**
     * Incrementa contador de cliques.
     */
    @Transactional
    public void incrementClick(UUID id) {
        Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anúncio não encontrado com ID: " + id));
        advertisement.setClickCount(advertisement.getClickCount() + 1);
        advertisementRepository.save(advertisement);
    }

    /**
     * Incrementa contador de impressões.
     */
    @Transactional
    public void incrementImpression(UUID id) {
        Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anúncio não encontrado com ID: " + id));
        advertisement.setImpressionCount(advertisement.getImpressionCount() + 1);
        advertisementRepository.save(advertisement);
    }

    /**
     * Converte entidade para DTO de resposta.
     */
    private AdvertisementResponse toResponse(Advertisement advertisement) {
        return new AdvertisementResponse(
                advertisement.getId().toString(),
                advertisement.getTitle(),
                advertisement.getImageUrl(),
                advertisement.getLinkUrl(),
                advertisement.getWidth(),
                advertisement.getHeight(),
                advertisement.getLocation(),
                advertisement.getIsActive(),
                advertisement.getStartDate(),
                advertisement.getEndDate(),
                advertisement.getClickCount(),
                advertisement.getImpressionCount(),
                advertisement.getCreatedAt(),
                advertisement.getUpdatedAt()
        );
    }
}
