"""Configuração da conexão com o banco de dados usando SQLAlchemy.

Este módulo lê as variáveis de ambiente (carregadas pelo main.py)
para configurar a URL do banco de dados, a 'engine' do SQLAlchemy e
a sessão (SessionLocal).

Fornece a função 'get_db' para ser usada como dependência do FastAPI.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Lê as variáveis de ambiente (carregadas pelo main.py) com valores padrão
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "jcpm_db")

# Monta a URL de conexão
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    # Cria a engine principal do SQLAlchemy
    engine = create_engine(DATABASE_URL)
    # Cria a fábrica de sessões
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    # Cria a Base declarativa para os modelos (Models)
    Base = declarative_base()
    print("Conexão com o banco de dados configurada com sucesso.")
except Exception as e:
    print(f"Erro ao configurar a conexão com o banco de dados: {e}")
    engine = None
    SessionLocal = None
    Base = None

def get_db():
    """Gerador de sessão de banco de dados para dependências do FastAPI.

    Garante que a sessão do banco de dados seja aberta no início da
    requisição e fechada ao final, mesmo se ocorrerem erros.

    Yields:
        Session: A sessão SQLAlchemy ativa.
    """
    if SessionLocal is None:
        raise RuntimeError("A fábrica de sessões (SessionLocal) não foi inicializada.")

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
