"""Ponto de entrada principal da API de Agentes (FastAPI).

Este módulo inicializa a aplicação FastAPI, carrega as variáveis de ambiente
do arquivo .env centralizado na raiz do projeto (JCPE/.env) e define
os endpoints da API, como /chat.
"""

import os
from fastapi import FastAPI
from pydantic import BaseModel, Field, ConfigDict
from dotenv import load_dotenv
from pathlib import Path  # Importar Path
from app.crew import run_crew

# Carrega variáveis de ambiente do .env na raiz do projeto
# (Ex: JCPE/.env), subindo dois níveis (agents/app -> agents -> JCPE)
dotenv_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI(
    title="jcpe News Agent API",
    description="API para interagir com o sistema de agentes de notícias jcpe.",
    version="0.1.0"
)


class ChatRequest(BaseModel):
    """Define o schema de entrada para requisições /chat.

    Utiliza 'alias' para compatibilidade com JSON (userId) e Python (user_id).
    """
    model_config = ConfigDict(populate_by_name=True)
    user_id: str = Field(..., alias='userId')
    query: str


class ChatResponse(BaseModel):
    """Define o schema de saída para respostas /chat."""
    response: str


@app.get("/", tags=["Health Check"])
def read_root():
    """Endpoint de verificação de saúde (Health Check).

    Retorna:
        dict: Um objeto JSON indicando que a API está operacional.
    """
    return {"status": "ok", "message": "Bem-vindo à API de Agentes jcpe!"}


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest) -> ChatResponse:
    """Endpoint principal para interagir com a equipe de agentes (Crew).

    Recebe o ID do usuário e a consulta, executa a equipe (crew) e
    retorna a resposta gerada.

    Args:
        request: O corpo da requisição contendo user_id e query.

    Returns:
        ChatResponse: A resposta processada pela equipe de agentes.
    """
    print(f"Recebida requisição de chat para user_id: {request.user_id} com query: '{request.query}'")

    # Executa a equipe
    crew_result = run_crew(request.user_id, request.query)

    return ChatResponse(response=crew_result)
