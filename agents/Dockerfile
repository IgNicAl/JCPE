# syntax=docker/dockerfile:1.7
# =======================================================================
# DOCKERFILE PARA O SERVIÇO DE AGENTES (Python FastAPI)
# =======================================================================

# -----------------------------------------------------------------------
# Estágio 1: Build
#
# - Instala dependências de compilação.
# - Cria 'wheels' para as dependências Python, o que acelera a
#   instalação no estágio final e torna o build mais eficiente.
# -----------------------------------------------------------------------
FROM python:3.11.9-slim-bookworm AS build

LABEL maintainer="seu-nome@example.com"
LABEL description="Build stage for Python Agent Service."

# Prevenir a criação de arquivos __pycache__ e garante logs em tempo real
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instala o essencial para compilar algumas bibliotecas Python
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copia e instala dependências usando wheels para acelerar o processo
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip && \
    pip wheel --wheel-dir /wheels -r requirements.txt

# -----------------------------------------------------------------------
# Estágio 2: Final
#
# - Imagem final, mais leve e segura.
# - Copia os 'wheels' pré-compilados e o código da aplicação.
# - Expõe a porta e define o comando de inicialização.
# -----------------------------------------------------------------------
FROM python:3.11.9-slim-bookworm AS final

LABEL maintainer="seu-nome@example.com"
LABEL description="Production image for Python Agent Service."

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instala curl para healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Instala as dependências a partir dos wheels, sem precisar compilar
COPY --from=build /wheels /wheels
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels

# Copia o código da aplicação
COPY app ./app
COPY config ./config

# Expõe a porta que a aplicação vai rodar
EXPOSE 8001

# Healthcheck para verificar se a API está respondendo
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

# Comando para iniciar a aplicação
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]

