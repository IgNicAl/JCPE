package br.com.jcpm.api.controller;

import java.util.List;
import java.util.UUID;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.dto.AdvertisementRequest;
import br.com.jcpm.api.dto.AdvertisementResponse;
import br.com.jcpm.api.service.AdvertisementService;
import jakarta.validation.Valid;

/**
 * Controller REST para gerenciar anúncios.
 */
@RestController
@RequestMapping("/api/advertisements")
public class AdvertisementController {

    @Autowired
    private AdvertisementService advertisementService;

    /**
     * Lista todos os anúncios.
     * Público - qualquer um pode listar.
     */
    @GetMapping
    public ResponseEntity<List<AdvertisementResponse>> findAll(
            @RequestParam(required = false) String location) {
        if (location != null) {
            return ResponseEntity.ok(advertisementService.findByLocation(location));
        }
        return ResponseEntity.ok(advertisementService.findAll());
    }

    /**
     * Lista apenas anúncios ativos.
     * Público - qualquer um pode listar ativos.
     */
    @GetMapping("/active")
    public ResponseEntity<List<AdvertisementResponse>> findActive(
            @RequestParam(required = false) String location) {
        if (location != null) {
            return ResponseEntity.ok(advertisementService.findActiveByLocation(location));
        }
        return ResponseEntity.ok(advertisementService.findActive());
    }

    /**
     * Busca anúncio por ID.
     * Público - qualquer um pode buscar.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdvertisementResponse> findById(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return ResponseEntity.ok(advertisementService.findById(uuid));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cria novo anúncio.
     * Restrito - apenas ADMIN pode criar.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdvertisementResponse> create(@Valid @RequestBody AdvertisementRequest request) {
        AdvertisementResponse created = advertisementService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Atualiza anúncio existente.
     * Restrito - apenas ADMIN pode atualizar.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdvertisementResponse> update(
            @PathVariable String id,
            @Valid @RequestBody AdvertisementRequest request) {
        try {
            UUID uuid = UUID.fromString(id);
            AdvertisementResponse updated = advertisementService.update(uuid, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deleta anúncio.
     * Restrito - apenas ADMIN pode deletar.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            advertisementService.delete(uuid);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Incrementa contador de cliques.
     * Público - qualquer um pode registrar click.
     */
    @PostMapping("/{id}/click")
    public ResponseEntity<Void> incrementClick(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            advertisementService.incrementClick(uuid);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Incrementa contador de impressões.
     * Público - qualquer um pode registrar impressão.
     */
    @PostMapping("/{id}/impression")
    public ResponseEntity<Void> incrementImpression(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            advertisementService.incrementImpression(uuid);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
