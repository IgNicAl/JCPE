"""Agrega todas as funções-ferramenta em um único local.

Este módulo importa as funções de ferramenta dos módulos de banco de dados,
API de notícias e serviços de LLM, e as expõe como ferramentas simples
(funções) que podem ser facilmente anexadas aos agentes do CrewAI.
"""

from app.tools.database_tools import get_user_preferences, save_user_preference
from app.tools.news_api_tools import search_news
from app.services.llm_service import summarize_text


def db_tool(user_id: str, key: str = None, value: str = None) -> dict | list:
    """Ferramenta para obter ou salvar preferências de notícias do usuário.

    Args:
        user_id: O ID do usuário (UUID como string).
        key (opcional): A chave da preferência a ser salva (ex: 'topicos').
        value (opcional): O valor da preferência a ser salvo.

    Returns:
        Se 'key' e 'value' forem fornecidos, retorna um dict com o status
        da operação de salvamento.
        Caso contrário, retorna uma lista de dicionários com as
        preferências existentes.
    """
    if key and value:
        return save_user_preference(user_id, key, value)
    else:
        return get_user_preferences(user_id)


def news_search_tool(query: str) -> dict:
    """Ferramenta para buscar artigos de notícias recentes sobre um tópico.

    Args:
        query: O tópico de busca.

    Returns:
        dict: Um dicionário com o status e os artigos encontrados.
    """
    return search_news(query)


def summarizer_tool(text: str, query: str) -> str:
    """Ferramenta para resumir um texto com foco em uma consulta.

    Args:
        text: O texto completo a ser resumido.
        query: A consulta que define o foco do resumo.

    Returns:
        str: O texto resumido.
    """
    return summarize_text(text, query)
