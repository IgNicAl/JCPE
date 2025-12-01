"""Versão assíncrona das funções de banco de dados.

Este módulo contém a lógica async para buscar e salvar preferências do usuário
usando aiomysql e SQLAlchemy async.
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select
from app.models import User, UserPreference
import uuid
import logging
import os

logger = logging.getLogger(__name__)

# Define as chaves de preferência permitidas
ALLOWED_PREFERENCE_KEYS = {"topic", "source", "author"}

# Configuração do banco de dados assíncrono
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "senha")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "jcpe_db")

DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Engine assíncrono
async_engine = create_async_engine(
    DATABASE_URL, echo=False, pool_pre_ping=True, pool_size=10, max_overflow=20
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)


async def get_user_preferences_async(user_id: str) -> list[dict]:
    """Busca as preferências de um usuário no banco de dados (async).

    Args:
        user_id: O ID do usuário (UUID como string).

    Returns:
        list[dict]: Uma lista de dicionários com as preferências.
                    Retorna lista vazia se não encontrar ou der erro.
    """
    async with AsyncSessionLocal() as db:
        try:
            user_uuid = uuid.UUID(user_id)
            stmt = select(UserPreference).where(
                UserPreference.user_id == str(user_uuid)
            )
            result = await db.execute(stmt)
            preferences = result.scalars().all()

            pref_list = [{p.key: p.value} for p in preferences]
            logger.debug(
                f"📚 Preferências carregadas: user_id={user_id}, total={len(pref_list)}"
            )
            return pref_list
        except Exception as e:
            logger.error(f"Erro ao buscar preferências para o usuário {user_id}: {e}")
            return []


async def save_user_preference_async(user_id: str, key: str, value: str) -> dict:
    """Salva ou atualiza uma preferência de usuário no banco de dados (async).

    Args:
        user_id: O ID do usuário (UUID como string).
        key: A chave da preferência (deve ser uma das chaves permitidas).
        value: O valor da preferência.

    Returns:
        dict: Um dicionário indicando o status e mensagem.
    """
    # Validação de segurança
    if key not in ALLOWED_PREFERENCE_KEYS:
        return {
            "status": "error",
            "message": f"A chave de preferência '{key}' não é permitida.",
        }

    async with AsyncSessionLocal() as db:
        try:
            user_uuid = uuid.UUID(user_id)

            # Verifica se o usuário existe
            user_stmt = select(User).where(User.id == str(user_uuid))
            user_result = await db.execute(user_stmt)
            user = user_result.scalar_one_or_none()

            if not user:
                return {
                    "status": "error",
                    "message": f"Usuário com id {user_id} não encontrado.",
                }

            # Verifica se a preferência já existe
            pref_stmt = select(UserPreference).where(
                UserPreference.user_id == str(user_uuid), UserPreference.key == key
            )
            pref_result = await db.execute(pref_stmt)
            preference = pref_result.scalar_one_or_none()

            if preference:
                # Atualiza a preferência existente
                preference.value = value
                status_message = "Preferência atualizada com sucesso."
                logger.info(f"✏️ Preferência atualizada: user_id={user_id}, key={key}")
            else:
                # Cria uma nova preferência
                preference = UserPreference(
                    user_id=str(user_uuid), key=key, value=value
                )
                db.add(preference)
                status_message = "Preferência criada com sucesso."
                logger.info(f"➕ Preferência criada: user_id={user_id}, key={key}")

            await db.commit()

            return {
                "status": "success",
                "message": status_message,
                "preference": {"key": key, "value": value},
            }
        except Exception as e:
            await db.rollback()
            logger.error(f"Erro ao salvar preferência para o usuário {user_id}: {e}")
            return {" status": "error", "message": str(e)}


# Compatibilidade com código síncrono (fallback thread-safe)
def get_user_preferences(user_id: str) -> list[dict]:
    """Versão síncrona (fallback) para compatibilidade.

    Usa nest_asyncio para permitir execução em event loops já rodando.
    """
    import asyncio
    import nest_asyncio

    # Permite aninhamento de event loops
    nest_asyncio.apply()

    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Se o loop já está rodando, usa nest_asyncio
            return loop.run_until_complete(get_user_preferences_async(user_id))
        else:
            # Se não está rodando, executa normalmente
            return asyncio.run(get_user_preferences_async(user_id))
    except RuntimeError:
        # Cria novo loop se necessário
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(get_user_preferences_async(user_id))
        finally:
            loop.close()


def save_user_preference(user_id: str, key: str, value: str) -> dict:
    """Versão síncrona (fallback) para compatibilidade.

    Usa nest_asyncio para permitir execução em event loops já rodando.
    """
    import asyncio
    import nest_asyncio

    # Permite aninhamento de event loops
    nest_asyncio.apply()

    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Se o loop já está rodando, usa nest_asyncio
            return loop.run_until_complete(
                save_user_preference_async(user_id, key, value)
            )
        else:
            # Se não está rodando, executa normalmente
            return asyncio.run(save_user_preference_async(user_id, key, value))
    except RuntimeError:
        # Cria novo loop se necessário
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(
                save_user_preference_async(user_id, key, value)
            )
        finally:
            loop.close()
