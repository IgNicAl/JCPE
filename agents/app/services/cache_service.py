"""Cache service usando Redis para otimizar performance."""

import redis.asyncio as redis
import json
import logging
from typing import Any, Optional
from datetime import timedelta

logger = logging.getLogger(__name__)


class CacheService:
    """Serviço de cache com Redis."""

    def __init__(
        self,
        host: str = "localhost",
        port: int = 6379,
        db: int = 0,
        default_ttl: int = 3600,  # 1 hora
    ):
        """Inicializa conexão com Redis.

        Args:
            host: Host do Redis
            port: Porta do Redis
            db: Database do Redis
            default_ttl: TTL padrão em segundos
        """
        self.redis_client: Optional[redis.Redis] = None
        self.host = host
        self.port = port
        self.db = db
        self.default_ttl = default_ttl
        self._connected = False

    async def connect(self):
        """Conecta ao Redis."""
        try:
            self.redis_client = await redis.Redis(
                host=self.host, port=self.port, db=self.db, decode_responses=True
            )
            # Testa conexão
            await self.redis_client.ping()
            self._connected = True
            logger.info(f"✅ Conectado ao Redis em {self.host}:{self.port}")
        except Exception as e:
            logger.warning(
                f"⚠️ Não foi possível conectar ao Redis: {e}. Cache desabilitado."
            )
            self._connected = False

    async def disconnect(self):
        """Desconecta do Redis."""
        if self.redis_client:
            await self.redis_client.close()
            self._connected = False
            logger.info("Redis desconectado")

    def _make_key(self, prefix: str, key: str) -> str:
        """Cria chave com prefixo."""
        return f"{prefix}:{key}"

    async def get(self, key: str, prefix: str = "jcpe") -> Optional[Any]:
        """Busca valor do cache.

        Args:
            key: Chave do cache
            prefix: Prefixo da chave

        Returns:
            Valor do cache ou None
        """
        if not self._connected:
            return None

        try:
            cache_key = self._make_key(prefix, key)
            value = await self.redis_client.get(cache_key)

            if value:
                logger.debug(f"🎯 Cache HIT: {cache_key}")
                return json.loads(value)

            logger.debug(f"❌ Cache MISS: {cache_key}")
            return None
        except Exception as e:
            logger.error(f"Erro ao buscar cache: {e}")
            return None

    async def set(
        self, key: str, value: Any, ttl: Optional[int] = None, prefix: str = "jcpe"
    ) -> bool:
        """Salva valor no cache.

        Args:
            key: Chave do cache
            value: Valor a ser salvo
            ttl: Time to live em segundos (None = default_ttl)
            prefix: Prefixo da chave

        Returns:
            True se sucesso, False caso contrário
        """
        if not self._connected:
            return False

        try:
            cache_key = self._make_key(prefix, key)
            ttl_seconds = ttl or self.default_ttl

            await self.redis_client.setex(
                cache_key, timedelta(seconds=ttl_seconds), json.dumps(value)
            )

            logger.debug(f"💾 Cache SET: {cache_key} (TTL: {ttl_seconds}s)")
            return True
        except Exception as e:
            logger.error(f"Erro ao salvar cache: {e}")
            return False

    async def delete(self, key: str, prefix: str = "jcpe") -> bool:
        """Remove valor do cache.

        Args:
            key: Chave do cache
            prefix: Prefixo da chave

        Returns:
            True se removido, False caso contrário
        """
        if not self._connected:
            return False

        try:
            cache_key = self._make_key(prefix, key)
            result = await self.redis_client.delete(cache_key)
            logger.debug(f"🗑️ Cache DELETE: {cache_key}")
            return result > 0
        except Exception as e:
            logger.error(f"Erro ao deletar cache: {e}")
            return False

    async def clear_prefix(self, prefix: str = "jcpe") -> int:
        """Remove todas as chaves com o prefixo.

        Args:
            prefix: Prefixo a ser limpo

        Returns:
            Número de chaves removidas
        """
        if not self._connected:
            return 0

        try:
            pattern = f"{prefix}:*"
            keys = []
            async for key in self.redis_client.scan_iter(match=pattern):
                keys.append(key)

            if keys:
                result = await self.redis_client.delete(*keys)
                logger.info(
                    f"🧹 Cache CLEAR: {result} chaves removidas com prefixo '{prefix}'"
                )
                return result

            return 0
        except Exception as e:
            logger.error(f"Erro ao limpar cache: {e}")
            return 0


# Instância global do cache
cache_service = CacheService()
