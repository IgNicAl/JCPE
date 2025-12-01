"""Rate limiter para controlar requisições por usuário."""

import time
from collections import defaultdict
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class RateLimiter:
    """Rate limiter baseado em sliding window."""

    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        """Inicializa rate limiter.

        Args:
            max_requests: Número máximo de requisições
            window_seconds: Janela de tempo em segundos
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)

    def _clean_old_requests(self, user_id: str, current_time: float):
        """Remove requisições antigas fora da janela."""
        cutoff_time = current_time - self.window_seconds
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id] if req_time > cutoff_time
        ]

    def check_rate_limit(self, user_id: str) -> Tuple[bool, int]:
        """Verifica se usuário excedeu o rate limit.

        Args:
            user_id: ID do usuário

        Returns:
            Tupla (allowed, remaining) onde:
            - allowed: True se permitido, False se bloqueado
            - remaining: Número de requisições restantes
        """
        current_time = time.time()

        # Limpa requisições antigas
        self._clean_old_requests(user_id, current_time)

        # Conta requisições na janela
        request_count = len(self.requests[user_id])

        if request_count >= self.max_requests:
            logger.warning(
                f"⛔ Rate limit excedido: user_id={user_id}, "
                f"{request_count}/{self.max_requests} requests"
            )
            return False, 0

        # Adiciona nova requisição
        self.requests[user_id].append(current_time)
        remaining = self.max_requests - (request_count + 1)

        logger.debug(
            f"✅ Rate limit OK: user_id={user_id}, "
            f"requests={request_count + 1}/{self.max_requests}, "
            f"remaining={remaining}"
        )

        return True, remaining

    def reset_user(self, user_id: str):
        """Reseta contadores de um usuário.

        Args:
            user_id: ID do usuário
        """
        if user_id in self.requests:
            del self.requests[user_id]
            logger.info(f"🔄 Rate limit resetado para user_id={user_id}")


# Instância global
rate_limiter = RateLimiter(max_requests=15, window_seconds=60)
