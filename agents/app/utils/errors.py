"""Sistema de tratamento de erros estruturado."""

from enum import Enum
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class ErrorCode(Enum):
    """Códigos de erro padronizados."""

    # Erros de validação (4xx)
    INVALID_USER_ID = ("INVALID_USER_ID", 400, "ID de usuário inválido.")
    INVALID_QUERY = ("INVALID_QUERY", 400, "Consulta inválida ou vazia.")
    UNSAFE_QUERY = ("UNSAFE_QUERY", 400, "Consulta contém padrões suspeitos.")
    RATE_LIMIT_EXCEEDED = ("RATE_LIMIT", 429, "Limite de requisições excedido. Aguarde 1 minuto.")

    # Erros de sistema (5xx)
    DATABASE_ERROR = ("DB_ERROR", 500, "Erro ao acessar banco de dados.")
    LLM_ERROR = ("LLM_ERROR", 500, "Erro ao processar com o modelo de linguagem.")
    NEWS_API_ERROR = ("NEWS_API_ERROR", 503, "Serviço de notícias temporariamente indisponível.")
    CACHE_ERROR = ("CACHE_ERROR", 500, "Erro no sistema de cache.")
    VALIDATION_ERROR = ("VALIDATION_ERROR", 500, "Falha na validação de saída.")
    UNKNOWN_ERROR = ("UNKNOWN", 500, "Erro inesperado no sistema.")


class AgentException(Exception):
    """Exceção customizada para erros dos agentes."""

    def __init__(
        self,
        error_code: ErrorCode,
        details: Optional[str] = None,
        original_exception: Optional[Exception] = None
    ):
        self.code = error_code.value[0]
        self.http_status = error_code.value[1]
        self.message = error_code.value[2]
        self.details = details
        self.original = original_exception

        # Log automático de erros
        if self.http_status >= 500:
            logger.error(
                f"[{self.code}] {self.message}",
                extra={
                    "details": details,
                    "original_error": str(original_exception) if original_exception else None
                },
                exc_info=original_exception
            )
        else:
            logger.warning(f"[{self.code}] {self.message} - Details: {details}")

        super().__init__(self.message)

    def to_dict(self) -> dict:
        """Converte para dicionário JSON-serializable."""
        return {
            "error_code": self.code,
            "message": self.message,
            "details": self.details
        }
