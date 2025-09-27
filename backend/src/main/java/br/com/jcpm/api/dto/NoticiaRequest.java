package br.com.jcpm.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class NoticiaRequest {

    @NotBlank(message = "Título não pode ser vazio")
    @Size(min = 5, max = 255, message = "Título deve ter entre 5 e 255 caracteres")
    private String titulo;

    @NotBlank(message = "Resumo não pode ser vazio")
    private String resumo;

    @NotBlank(message = "Conteúdo não pode ser vazio")
    private String conteudo;

    @NotBlank(message = "URL da imagem não pode ser vazia")
    private String urlImagemDestaque;

    @NotNull(message = "Prioridade não pode ser nula")
    private Integer prioridade;

    // Getters
    public String getTitulo() { return titulo; }
    public String getResumo() { return resumo; }
    public String getConteudo() { return conteudo; }
    public String getUrlImagemDestaque() { return urlImagemDestaque; }
    public Integer getPrioridade() { return prioridade; }

    // Setters
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setResumo(String resumo) { this.resumo = resumo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public void setUrlImagemDestaque(String urlImagemDestaque) { this.urlImagemDestaque = urlImagemDestaque; }
    public void setPrioridade(Integer prioridade) { this.prioridade = prioridade; }
}
