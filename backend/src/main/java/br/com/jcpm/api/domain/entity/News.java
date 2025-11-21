package br.com.jcpm.api.domain.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa a entidade Notícia no banco de dados.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "noticias")
public class News {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @JdbcTypeCode(SqlTypes.VARCHAR)
  @Column(columnDefinition = "CHAR(36)")
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "autor_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  private User author;

  @NotBlank(message = "Título é obrigatório")
  @Column(nullable = false)
  private String title;

  @NotBlank(message = "Slug é obrigatório")
  @Column(unique = true, nullable = false)
  private String slug;

  @NotBlank(message = "Resumo é obrigatório")
  @Column(length = 512, nullable = false)
  private String summary;

  @NotBlank(message = "Conteúdo é obrigatório")
  @Lob
  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  @Lob
  @Column(columnDefinition = "LONGTEXT", nullable = true)
  private String contentJson;

  // imagem de destaque agora pode ser opcional (nullable) — frontend pode não
  // enviar
  @Column(nullable = true)
  private String featuredImageUrl;

  @NotNull(message = "Prioridade é obrigatória")
  @Column(nullable = false)
  private Integer priority = 1;

  @NotNull(message = "Status é obrigatório")
  @Column(nullable = false)
  private String status = "RASCUNHO"; // RASCUNHO ou PUBLICADO

  @Column(nullable = true)
  private String page = "noticias"; // página onde a notícia será publicada

  @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
  private Boolean isFeaturedHome = false; // se é destaque na página principal (Home)

  @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
  private Boolean isFeaturedPage = false; // se é destaque na página específica

  @ManyToOne
  @JoinColumn(name = "category_id", nullable = true)
  private Category category;

  @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
  @JoinTable(
    name = "noticia_tags",
    joinColumns = @JoinColumn(name = "noticia_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id")
  )
  private Set<Tag> tags = new HashSet<>();

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime publicationDate;

  @UpdateTimestamp
  private LocalDateTime updateDate;

  // Getters e Setters Explícitos (gerados por Lombok @Data, mas adicionados para
  // suporte IDE)
  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public User getAuthor() {
    return author;
  }

  public void setAuthor(User author) {
    this.author = author;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
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

  public LocalDateTime getPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(LocalDateTime publicationDate) {
    this.publicationDate = publicationDate;
  }

  public LocalDateTime getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(LocalDateTime updateDate) {
    this.updateDate = updateDate;
  }

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public Set<Tag> getTags() {
    return tags;
  }

  public void setTags(Set<Tag> tags) {
    this.tags = tags;
  }
}
