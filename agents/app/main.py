"""Ponto de entrada principal da API de Agentes (FastAPI).

Este módulo inicializa a aplicação FastAPI, carrega as variáveis de ambiente
do arquivo .env centralizado na raiz do projeto (JCPE/.env) e define
os endpoints da API, como /chat.
"""

import logging
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from pathlib import Path
from app.crew import run_crew
from app.utils.security import sanitize_user_query, validate_user_id
from app.utils.errors import AgentException, ErrorCode
from app.services.cache_service import cache_service
from app.services.rate_limiter import rate_limiter
from app.services.metrics import track_request, get_metrics, crew_execution_duration
import time
import sys

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

logger = logging.getLogger(__name__)

# Carrega variáveis de ambiente do .env na raiz do projeto
dotenv_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia lifecycle da aplicação (startup/shutdown)."""
    # Startup
    logger.info("🚀 Iniciando aplicação...")
    await cache_service.connect()
    logger.info("✅ Aplicação pronta!")

    yield

    # Shutdown
    logger.info("🛑 Encerrando aplicação...")
    await cache_service.disconnect()
    logger.info("👋 Aplicação encerrada")


app = FastAPI(
    title="JCPE News Agents API",
    description="API para agentes de notícias inteligentes",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    """Define o schema de entrada para requisições /chat.

    Utiliza 'alias' para compatibilidade com JSON (userId) e Python (user_id).
    """

    model_config = ConfigDict(populate_by_name=True)
    user_id: str = Field(..., alias="userId", description="UUID do usuário")
    query: str = Field(
        ..., description="Consulta do usuário", min_length=1, max_length=500
    )


class ChatResponse(BaseModel):
    """Define o schema de saída para respostas /chat."""

    response: str


@app.get("/", tags=["Health Check"])
def read_root():
    """Endpoint de verificação de saúde (Health Check).

    Retorna:
        dict: Um objeto JSON indicando que a API está operacional.
    """
    return {
        "status": "ok",
        "message": "Bem-vindo à API de Agentes JCPE (v2.0)!",
        "version": "2.0.0",
        "cache_connected": cache_service._connected,
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    """Health check detalhado."""
    return {
        "status": "healthy",
        "cache": "connected" if cache_service._connected else "disconnected",
        "version": "2.0.0",
    }


@app.get("/metrics", tags=["Observability"])
async def metrics():
    """Endpoint de métricas Prometheus."""
    return Response(content=get_metrics(), media_type="text/plain; version=0.0.4")


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
@track_request("chat")
async def chat(request: ChatRequest, http_request: Request) -> ChatResponse:
    """Endpoint principal para interagir com a equipe de agentes (Crew).

    Recebe o ID do usuário e a consulta, executa a equipe (crew) e
    retorna a resposta gerada.

    Args:
        request: O corpo da requisição contendo user_id e query.
        http_request: Request original do FastAPI para obter IP.

    Returns:
        ChatResponse: A resposta processada pela equipe de agentes.
    """
    user_id = request.user_id
    query = request.query

    logger.info(f"📨 Requisição recebida de user_id={user_id}")

    # Rate limiting
    allowed, remaining = rate_limiter.check_rate_limit(user_id)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "RATE_LIMIT_EXCEEDED",
                "message": "Você excedeu o limite de requisições. Tente novamente em alguns segundos.",
            },
        )

    # Cache check
    cache_key = f"chat:{user_id}:{query[:50]}"
    cached_response = await cache_service.get(cache_key)
    if cached_response:
        logger.info(f"🎯 Cache HIT para user_id={user_id}")
        return ChatResponse(response=cached_response)

    # 1. VALIDAÇÃO DE USER_ID
    if not validate_user_id(request.user_id):
        logger.warning(f"⚠️ UUID inválido: {request.user_id}")
        raise HTTPException(
            status_code=400,
            detail={
                "error_code": ErrorCode.INVALID_USER_ID.value[0],
                "message": ErrorCode.INVALID_USER_ID.value[2],
            },
        )

    # 2. SANITIZAÇÃO DE QUERY
    validation = sanitize_user_query(request.query)

    if not validation["is_safe"]:
        logger.warning(
            f"🛡️ Query insegura detectada de {request.user_id}: "
            f"{validation['detected_threats']}"
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error_code": ErrorCode.UNSAFE_QUERY.value[0],
                "message": "Consulta contém padrões inválidos. Reformule de forma mais clara.",
                "threats": validation["detected_threats"],
            },
        )

    # 3. Executa a Crew
    try:
        start_time = time.time()
        crew_result = run_crew(user_id, validation["sanitized_query"])
        execution_time = time.time() - start_time
        crew_execution_duration.observe(execution_time)

        logger.info(f"✅ Resposta gerada para user_id={request.user_id}")

        return ChatResponse(response=crew_result)

    except AgentException as e:
        logger.error(f"❌ AgentException: {e.code} - {e.message}")
        raise HTTPException(status_code=e.http_status, detail=e.to_dict())

    except Exception as e:
        logger.exception(f"❌ Erro inesperado: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error_code": "UNKNOWN_ERROR",
                "message": "Erro inesperado no sistema. Por favor, tente novamente.",
            },
        )
