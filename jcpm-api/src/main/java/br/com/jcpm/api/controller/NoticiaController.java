package br.com.jcpm.api.controller;

import java.time.LocalDateTime;
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

import br.com.jcpm.api.model.Noticia;
import br.com.jcpm.api.model.User;
import br.com.jcpm.api.repository.NoticiaRepository;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticiaController {

    @Autowired
    private NoticiaRepository noticiaRepository;

    // Público - Listar todas as notícias
    @GetMapping
    public List<Noticia> getAllNoticias() {
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
    public ResponseEntity<Noticia> createNoticia(@RequestBody Noticia noticia) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        
        noticia.setAutor(currentUser);
        noticia.setDataPublicacao(LocalDateTime.now());
        Noticia novaNoticia = noticiaRepository.save(noticia);
        return new ResponseEntity<>(novaNoticia, HttpStatus.CREATED);
    }

    // ADMIN pode editar qualquer notícia, JORNALISTA só pode editar suas próprias
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('JORNALISTA') or hasRole('ADMIN')")
    public ResponseEntity<Noticia> updateNoticia(@PathVariable Long id, @RequestBody Noticia noticiaDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        
        return noticiaRepository.findById(id)
                .map(noticia -> {
                    // ADMIN pode editar qualquer notícia
                    // JORNALISTA só pode editar suas próprias notícias
                    if (!currentUser.getTipoUsuario().name().equals("ADMIN") && 
                        !noticia.getAutor().getId().equals(currentUser.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Noticia>build();
                    }
                    
                    noticia.setTitulo(noticiaDetails.getTitulo());
                    noticia.setResumo(noticiaDetails.getResumo());
                    noticia.setConteudo(noticiaDetails.getConteudo());
                    noticia.setUrlImagemDestaque(noticiaDetails.getUrlImagemDestaque());
                    noticia.setDataAtualizacao(LocalDateTime.now());
                    
                    Noticia updatedNoticia = noticiaRepository.save(noticia);
                    return ResponseEntity.ok(updatedNoticia);
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ADMIN pode deletar qualquer notícia, JORNALISTA só pode deletar suas próprias
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JORNALISTA') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNoticia(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        
        return noticiaRepository.findById(id)
                .map(noticia -> {
                    // ADMIN pode deletar qualquer notícia
                    // JORNALISTA só pode deletar suas próprias notícias
                    if (!currentUser.getTipoUsuario().name().equals("ADMIN") && 
                        !noticia.getAutor().getId().equals(currentUser.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build();
                    }
                    
                    noticiaRepository.delete(noticia);
                    return ResponseEntity.noContent().<Void>build();
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
