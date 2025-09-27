package br.com.jcpm.api.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.jcpm.api.dto.NoticiaRequest;
import br.com.jcpm.api.model.Noticia;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.repository.NoticiaRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticiaController {

    private final NoticiaRepository noticiaRepository;

    @Autowired
    public NoticiaController(NoticiaRepository noticiaRepository) {
        this.noticiaRepository = noticiaRepository;
    }

    // Público - Listar todas as notícias
    @GetMapping
    public List<Noticia> getAllNoticias() { // Público - Listar todas as notícias
        return noticiaRepository.findAll();
    }

    // Público - Buscar notícia por ID
    @GetMapping("/{id}")
    public ResponseEntity<Noticia> getNoticiaById(@PathVariable Long id) {
        return noticiaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Apenas JORNALISTA e ADMIN podem criar notícias
    @PostMapping
    @PreAuthorize("hasRole('JORNALISTA') or hasRole('ADMIN')")
    public ResponseEntity<Noticia> createNoticia(@Valid @RequestBody NoticiaRequest noticiaRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Noticia noticia = new Noticia();
        noticia.setTitulo(noticiaRequest.getTitulo());
        noticia.setResumo(noticiaRequest.getResumo());
        noticia.setConteudo(noticiaRequest.getConteudo());
        noticia.setUrlImagemDestaque(noticiaRequest.getUrlImagemDestaque());
        noticia.setPrioridade(noticiaRequest.getPrioridade());
        noticia.setAutor(currentUser);
        noticia.setDataPublicacao(LocalDateTime.now());

        Noticia novaNoticia = noticiaRepository.save(noticia);
        return new ResponseEntity<>(novaNoticia, HttpStatus.CREATED);
    }

    // ADMIN pode editar qualquer notícia, JORNALISTA só pode editar suas próprias
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('JORNALISTA')")
    public ResponseEntity<?> updateNoticia(@PathVariable Long id, @Valid @RequestBody NoticiaRequest noticiaRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        return noticiaRepository.findById(id)
                .map(noticia -> {
                    // Verifica se o usuário é o dono da notícia ou se é um ADMIN
                    boolean isOwner = noticia.getAutor().getId().equals(currentUser.getId());
                    boolean isAdmin = "ADMIN".equals(currentUser.getTipoUser().name());

                    if (!isOwner && !isAdmin) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("error", "Você não tem permissão para editar esta notícia."));
                    }

                    noticia.setTitulo(noticiaRequest.getTitulo());
                    noticia.setResumo(noticiaRequest.getResumo());
                    noticia.setConteudo(noticiaRequest.getConteudo());
                    noticia.setUrlImagemDestaque(noticiaRequest.getUrlImagemDestaque());
                    noticia.setPrioridade(noticiaRequest.getPrioridade());
                    noticia.setDataAtualizacao(LocalDateTime.now());

                    Noticia updatedNoticia = noticiaRepository.save(noticia);
                    return ResponseEntity.ok(updatedNoticia);
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ADMIN pode deletar qualquer notícia, JORNALISTA só pode deletar suas próprias
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('JORNALISTA')")
    public ResponseEntity<?> deleteNoticia(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        return noticiaRepository.findById(id)
                .map(noticia -> {
                    // Verifica se o usuário é o dono da notícia ou se é um ADMIN
                    boolean isOwner = noticia.getAutor().getId().equals(currentUser.getId());
                    boolean isAdmin = "ADMIN".equals(currentUser.getTipoUser().name());

                    if (!isOwner && !isAdmin) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("error", "Você não tem permissão para excluir esta notícia."));
                    }

                    noticiaRepository.delete(noticia);
                    return ResponseEntity.noContent().build();
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
