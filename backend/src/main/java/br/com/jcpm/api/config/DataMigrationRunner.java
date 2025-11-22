package br.com.jcpm.api.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

/**
 * Componente para corrigir dados legados automaticamente na inicialização.
 * Converte valores antigos de status (PUBLICADO, RASCUNHO) para os novos valores do enum.
 */
@Slf4j
@Component
public class DataMigrationRunner {

  private final JdbcTemplate jdbcTemplate;

  public DataMigrationRunner(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @EventListener(ApplicationReadyEvent.class)
  @Transactional
  public void migrateOldNewsStatus() {
    try {
      log.info("Verificando e corrigindo status antigos de notícias...");

      // Converter PUBLICADO -> PUBLISHED
      int updatedPublished = jdbcTemplate.update(
          "UPDATE noticias SET status = 'PUBLISHED' WHERE status = 'PUBLICADO'"
      );

      // Converter RASCUNHO -> DRAFT
      int updatedDraft = jdbcTemplate.update(
          "UPDATE noticias SET status = 'DRAFT' WHERE status = 'RASCUNHO'"
      );

      if (updatedPublished > 0 || updatedDraft > 0) {
        log.info("✅ Status corrigidos: {} PUBLICADO→PUBLISHED, {} RASCUNHO→DRAFT",
            updatedPublished, updatedDraft);
      } else {
        log.info("✅ Nenhum status antigo encontrado. Banco de dados atualizado.");
      }

    } catch (Exception e) {
      log.warn("⚠️ Erro ao corrigir status antigos (pode ser normal se coluna já for enum): {}",
          e.getMessage());
    }
  }
}
