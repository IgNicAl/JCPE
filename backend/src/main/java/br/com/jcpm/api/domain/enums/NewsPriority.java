package br.com.jcpm.api.domain.enums;

/**
 * Enum que define a prioridade de uma notícia.
 */
public enum NewsPriority {
  LOW("Baixa"),
  MEDIUM("Média"),
  HIGH("Alta"),
  BREAKING("Urgente / Breaking News");

  private final String description;

  NewsPriority(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
