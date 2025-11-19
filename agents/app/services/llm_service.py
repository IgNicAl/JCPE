"""Serviço de configuração e interação com o Modelo de Linguagem (LLM).

Este módulo inicializa o cliente do LLM (ChatGoogleGenerativeAI) usando a
API Key fornecida pelas variáveis de ambiente (carregadas pelo main.py).

Fornece funções auxiliares como 'get_llm' e 'summarize_text'.
"""

import os
from crewai.llm import LLM
from langchain_core.prompts import ChatPromptTemplate

# Carrega a API Key (fornecida pelo main.py)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("Variável de ambiente GEMINI_API_KEY não definida.")

# Configura e instancia o LLM
llm = LLM(
    model="gemini/gemini-2.0-flash",
    api_key=GEMINI_API_KEY,
)


def get_llm() -> LLM:
    """Retorna a instância configurada do LLM.

    Returns:
        LLM: A instância global do LLM.
    """
    return llm


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
            ("system", "Você é um assistente prestativo que resume artigos de notícias em Português do Brasil (PT-BR). Seu resumo deve ser conciso, claro e diretamente relacionado à consulta do usuário."),
            ("human", "Por favor, resuma o seguinte texto com base nesta consulta: '{query}'\n\nTexto:\n---\n{text}"),
        ]
    )

    chain = prompt_template | llm.client

    try:
        response = chain.invoke({"text": text, "query": query})
        return response.content
    except Exception as e:
        print(f"Erro durante a sumarização: {e}")
        return "Desculpe, não foi possível resumir a notícia."
