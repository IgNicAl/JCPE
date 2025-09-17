package br.com.jcpm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.jcpm.model.Noticia;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
}
