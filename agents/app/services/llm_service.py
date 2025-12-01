"""Serviço de configuração e interação com o Modelo de Linguagem (LLM).

Este módulo inicializa o cliente do LLM (ChatGoogleGenerativeAI) usando a
API Key fornecida pelas variáveis de ambiente (carregadas pelo main.py).

Fornece funções auxiliares como 'get_llm' e 'summarize_text'.
"""

import os
from crewai.llm import LLM
from langchain_core.prompts import ChatPromptTemplate

# ============================================================================
# CONFIGURAÇÃO DO OLLAMA (Modelo Local - Gratuito e Ilimitado)
# ============================================================================
# Ollama roda localmente na porta 11434 por padrão
# Modelo: gemma2:9b (5.4GB) - Download via: ollama pull gemma2:9b
# ============================================================================

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "ollama/gemma2:9b")

# Configura e instancia o LLM padrão (Ollama)
llm = LLM(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
)


def get_llm() -> LLM:
    """Retorna LLM configurado padrão (Ollama).

    Returns:
        Instância configurada do LLM usando Ollama local
    """
    return LLM(
        model=OLLAMA_MODEL,
        base_url=OLLAMA_BASE_URL,
    )


# LLMs especializados (por enquanto, retornam o mesmo LLM)
# TODO: Investigar parâmetros corretos para CrewAI LLM
def get_factual_llm() -> LLM:
    """LLM para tarefas factuais (busca, classificação)."""
    return get_llm()


def get_creative_llm() -> LLM:
    """LLM para tarefas criativas (compilação, redação)."""
    return get_llm()


def summarize_text(text: str, query: str) -> str:
    """Resume um texto usando o LLM, focado em uma consulta específica.

    Args:
        text: O texto completo a ser resumido.
        query: A consulta do usuário, usada para guiar o foco do resumo.

    Returns:
        str: O resumo gerado em PT-BR, ou uma mensagem de erro.
    """
    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Você é um assistente prestativo que resume artigos de notícias em Português do Brasil (PT-BR). Seu resumo deve ser conciso (máx 100 palavras), claro e diretamente relacionado à consulta do usuário.",
            ),
            (
                "human",
                "Por favor, resuma o seguinte texto com base nesta consulta: '{query}'\\n\\nTexto:\\n---\\n{text}\\n---\\n\\nResumo:",
            ),
        ]
    )

    factual_llm = get_factual_llm()
    chain = prompt_template | factual_llm.client

    try:
        # Limita texto para evitar overflow de contexto
        response = chain.invoke({"text": text[:3000], "query": query})
        return response.content
    except Exception as e:
        print(f"Erro durante a sumarização: {e}")
        return "Desculpe, não foi possível resumir a notícia."
