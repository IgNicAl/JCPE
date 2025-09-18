package br.com.jcpm.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "noticias")
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String resumo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private User autor;

    private String urlImagemDestaque;

    @Column(nullable = false)
    private LocalDateTime dataPublicacao;

    private LocalDateTime dataAtualizacao;

    // Construtor padrão
    public Noticia() {
        this.dataPublicacao = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getResumo() { return resumo; }
    public void setResumo(String resumo) { this.resumo = resumo; }
    
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    
    public User getAutor() { return autor; }
    public void setAutor(User autor) { this.autor = autor; }
    
    public String getUrlImagemDestaque() { return urlImagemDestaque; }
    public void setUrlImagemDestaque(String urlImagemDestaque) { this.urlImagemDestaque = urlImagemDestaque; }
    
    public LocalDateTime getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(LocalDateTime dataPublicacao) { this.dataPublicacao = dataPublicacao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}
