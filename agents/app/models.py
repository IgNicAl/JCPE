"""Define os modelos de dados (schemas) do SQLAlchemy.

Este módulo contém as classes que mapeiam objetos Python para as tabelas
do banco de dados (ORM).

Modelos:
    - User: Representa a tabela 'users'.
    - UserPreference: Representa a tabela 'user_preferences'.
"""

import uuid
from sqlalchemy import (Column, String, ForeignKey, CHAR)
from sqlalchemy.orm import relationship
from config.database import Base  # Importa a Base declarativa


class User(Base):
    """Modelo ORM para a tabela 'users'.

    Atributos:
        id (str): Chave primária UUID (CHAR(36)).
        username (str): Nome de usuário único.
        email (str): Email único.
        preferences (relationship): Relação One-to-Many com UserPreference.
    """
    __tablename__ = 'users'

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    # Relação um-para-muitos com as preferências
    preferences = relationship("UserPreference", back_populates="user")

    def __repr__(self) -> str:
        """Representação em string do objeto User."""
        return f"<User(id={self.id}, username='{self.username}')>"


class UserPreference(Base):
    """Modelo ORM para a tabela 'user_preferences'.

    Atributos:
        id (str): Chave primária UUID (CHAR(36)).
        user_id (str): Chave estrangeira para 'users.id'.
        key (str): A chave da preferência (ex: 'topico_favorito').
        value (str): O valor da preferência (ex: 'esportes').
        user (relationship): Relação Many-to-One com User.
    """
    __tablename__ = 'user_preferences'

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(CHAR(36), ForeignKey('users.id'), nullable=False)
    key = Column("preference_key", String(100), nullable=False)
    value = Column("preference_value", String(255), nullable=False)
    # Relação muitos-para-um com o usuário
    user = relationship("User", back_populates="preferences")

    def __repr__(self) -> str:
        """Representação em string do objeto UserPreference."""
        return f"<UserPreference(user_id={self.user_id}, key='{self.key}', value='{self.value}')>"
