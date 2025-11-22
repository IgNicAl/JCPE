package br.com.jcpm.api.domain.enums;

/**
 * Enum que define os status de uma notícia no workflow de aprovação.
 */
public enum NewsStatus {
  DRAFT("Rascunho"),
  PENDING_REVIEW("Aguardando Revisão"),
  APPROVED("Aprovado"),
  REJECTED("Rejeitado"),
  PUBLISHED("Publicado");

  private final String description;

  NewsStatus(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
