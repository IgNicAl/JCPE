package br.com.jcpm.api.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsRequest {

  @NotBlank(message = "Título não pode ser vazio")
  @Size(min = 5, max = 255, message = "Título deve ter entre 5 e 255 caracteres")
  private String title;

  @NotBlank(message = "Resumo não pode ser vazio")
  private String summary;

  @NotBlank(message = "Conteúdo não pode ser vazio")
  private String content;

  private String contentJson;

  // imagem de capa agora é opcional no request (frontend pode enviar vazia)
  private String featuredImageUrl;

  @NotNull(message = "Prioridade não pode ser nula")
  private Integer priority;

  private String status;

  private String page; // página onde a notícia será publicada

  private Boolean isFeaturedHome; // se é destaque na página principal (Home)

  private Boolean isFeaturedPage; // se é destaque na página específica

  private UUID categoryId; // ID da categoria

  private List<UUID> tagIds; // IDs das tags associadas

  // Getters e Setters Explícitos (gerados por Lombok @Getter/@Setter, mas
  // adicionados para suporte IDE)
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getContentJson() {
    return contentJson;
  }

  public void setContentJson(String contentJson) {
    this.contentJson = contentJson;
  }

  public String getFeaturedImageUrl() {
    return featuredImageUrl;
  }

  public void setFeaturedImageUrl(String featuredImageUrl) {
    this.featuredImageUrl = featuredImageUrl;
  }

  public Integer getPriority() {
    return priority;
  }

  public void setPriority(Integer priority) {
    this.priority = priority;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getPage() {
    return page;
  }

  public void setPage(String page) {
    this.page = page;
  }

  public Boolean getIsFeaturedHome() {
    return isFeaturedHome;
  }

  public void setIsFeaturedHome(Boolean isFeaturedHome) {
    this.isFeaturedHome = isFeaturedHome;
  }

  public Boolean getIsFeaturedPage() {
    return isFeaturedPage;
  }

  public void setIsFeaturedPage(Boolean isFeaturedPage) {
    this.isFeaturedPage = isFeaturedPage;
  }

  public UUID getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(UUID categoryId) {
    this.categoryId = categoryId;
  }

  public List<UUID> getTagIds() {
    return tagIds;
  }

  public void setTagIds(List<UUID> tagIds) {
    this.tagIds = tagIds;
  }
}
