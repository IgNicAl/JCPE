"""Agrega todas as funções-ferramenta em um único local.

Este módulo importa as funções de ferramenta dos módulos de banco de dados,
API de notícias e serviços de LLM, e as expõe como ferramentas simples
(funções) que podem ser facilmente anexadas aos agentes do CrewAI.
"""
from crewai.tools import tool
from app.tools.database_tools import get_user_preferences, save_user_preference
from app.tools.news_api_tools import search_news
from app.services.llm_service import summarize_text


@tool("Get User Preferences Tool")
def get_user_preferences_tool(user_id: str) -> list:
    """Ferramenta para obter as preferências de notícias de um usuário.

    Args:
        user_id: O ID do usuário (UUID como string).

    Returns:
        Uma lista de dicionários com as preferências existentes.
    """
    return get_user_preferences(user_id)


@tool("Save User Preference Tool")
def save_user_preference_tool(user_id: str, key: str, value: str) -> dict:
    """Ferramenta para salvar uma preferência de notícia para um usuário.

    Args:
        user_id: O ID do usuário (UUID como string).
        key: A chave da preferência a ser salva (ex: 'topicos').
        value: O valor da preferência a ser salvo.

    Returns:
        Um dicionário com o status da operação de salvamento.
    """
    return save_user_preference(user_id, key, value)


@tool("News Search Tool")
def news_search_tool(query: str) -> dict:
    """Ferramenta para buscar artigos de notícias recentes sobre um tópico.

    Args:
        query: O tópico de busca.

    Returns:
        dict: Um dicionário com o status e os artigos encontrados.
    """
    return search_news(query)


@tool("Summarizer Tool")
def summarizer_tool(text: str, query: str) -> str:
    """Ferramenta para resumir um texto com foco em uma consulta.

    Args:
        text: O texto completo a ser resumido.
        query: A consulta que define o foco do resumo.

    Returns:
        str: O texto resumido.
    """
    return summarize_text(text, query)
