package br.com.jcpm.api.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import br.com.jcpm.api.repository.NoticiaRepository;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "http://localhost:3000")
public class NoticiaController {

    @Autowired
    private NoticiaRepository noticiaRepository;

    @GetMapping
    public List<Noticia> getAllNoticias() {
        return noticiaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Noticia> getNoticiaById(@PathVariable Long id) {
        return noticiaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Noticia> createNoticia(@RequestBody Noticia noticia) {
        noticia.setDataPublicacao(LocalDateTime.now());
        Noticia novaNoticia = noticiaRepository.save(noticia);
        return new ResponseEntity<>(novaNoticia, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Noticia> updateNoticia(@PathVariable Long id, @RequestBody Noticia noticiaDetails) {
        return noticiaRepository.findById(id)
                .map(noticia -> {
                    noticia.setTitulo(noticiaDetails.getTitulo());
                    noticia.setResumo(noticiaDetails.getResumo());
                    noticia.setConteudo(noticiaDetails.getConteudo());
                    noticia.setAutor(noticiaDetails.getAutor());
                    noticia.setUrlImagemDestaque(noticiaDetails.getUrlImagemDestaque());
                    Noticia updatedNoticia = noticiaRepository.save(noticia);
                    return ResponseEntity.ok(updatedNoticia);
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNoticia(@PathVariable Long id) {
        return noticiaRepository.findById(id)
                .map(noticia -> {
                    noticiaRepository.delete(noticia);
                    return ResponseEntity.noContent().<Void>build();
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
