"""Define as funções de interação direta com o banco de dados.

Este módulo contém a lógica para buscar e salvar preferências do usuário
no banco de dados, usando as sessões do SQLAlchemy.
"""

from sqlalchemy.orm import Session
from config.database import SessionLocal
from app.models import User, UserPreference
import uuid

# Define as chaves de preferência permitidas para aumentar a segurança
ALLOWED_PREFERENCE_KEYS = {'topic', 'source', 'author'}


def get_user_preferences(user_id: str) -> list[dict]:
    """Busca as preferências de um usuário no banco de dados.

    Args:
        user_id: O ID do usuário (UUID como string).

    Returns:
        list[dict]: Uma lista de dicionários, onde cada um representa
                    uma preferência (ex: [{'topico': 'esportes'}]).
                    Retorna uma lista vazia se não encontrar ou der erro.
    """
    db: Session = SessionLocal()
    try:
        user_uuid = uuid.UUID(user_id)
        preferences = db.query(UserPreference).filter(UserPreference.user_id == str(user_uuid)).all()
        return [{p.key: p.value} for p in preferences]
    except Exception as e:
        print(f"Erro ao buscar preferências para o usuário {user_id}: {e}")
        return []
    finally:
        db.close()


def save_user_preference(user_id: str, key: str, value: str) -> dict:
    """Salva ou atualiza uma preferência de usuário no banco de dados.

    Args:
        user_id: O ID do usuário (UUID como string).
        key: A chave da preferência (deve ser uma das chaves permitidas).
        value: O valor da preferência.

    Returns:
        dict: Um dicionário indicando o status ("success" ou "error")
              e uma mensagem descritiva.
    """
    # Validação de Segurança: Garante que apenas chaves permitidas sejam salvas.
    if key not in ALLOWED_PREFERENCE_KEYS:
        return {"status": "error", "message": f"A chave de preferência '{key}' não é permitida."}

    db: Session = SessionLocal()
    try:
        user_uuid = uuid.UUID(user_id)
        # Verifica se o usuário existe
        user = db.query(User).filter(User.id == str(user_uuid)).first()
        if not user:
            return {"status": "error", "message": f"Usuário com id {user_id} não encontrado."}

        # Verifica se a preferência já existe
        preference = db.query(UserPreference).filter(
            UserPreference.user_id == str(user_uuid),
            UserPreference.key == key
        ).first()

        if preference:
            # Atualiza a preferência existente
            preference.value = value
            status_message = "Preferência atualizada com sucesso."
        else:
            # Cria uma nova preferência
            preference = UserPreference(user_id=str(user_uuid), key=key, value=value)
            db.add(preference)
            status_message = "Preferência criada com sucesso."

        db.commit()
        return {"status": "success", "message": status_message, "preference": {"key": key, "value": value}}
    except Exception as e:
        db.rollback()
        print(f"Erro ao salvar preferência para o usuário {user_id}: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
