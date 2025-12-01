"""Define as ferramentas (Tools) que os agentes poderão usar via CrewAI.

Usa o decorador @tool do CrewAI para expor funções Python como ferramentas
disponíveis aos agentes.
"""

from crewai.tools import tool
from .database_tools import get_user_preferences, save_user_preference
from .jcpe_news_tools import search_jcpe_news


# ===== FERRAMENTAS DO BANCO DE DADOS =====


@tool("Get User Preferences Tool")
def get_user_preferences_tool(user_id: str) -> list:
    """Busca as preferências de um usuário no banco de dados.

    Args:
        user_id: O ID UUID do usuário.

    Returns:
        Uma lista de dicionários com as preferências do usuário.
    """
    return get_user_preferences(user_id)


@tool("Save User Preference Tool")
def save_user_preference_tool(user_id: str, key: str, value: str) -> dict:
    """Salva ou atualiza uma preferência do usuário no banco de dados.

    Args:
        user_id: O ID UUID do usuário.
        key: A chave da preferência (ex: 'topico_favorito', 'fonte_preferida').
        value: O valor da preferência (ex: 'esportes', 'TechCrunch').

    Returns:
        Um dicionário com o status da operação.
    """
    return save_user_preference(user_id, key, value)


# ===== FERRAMENTA DE BUSCA DE NOTÍCIAS JCPE =====


@tool("JCPE News Search Tool")
def jcpe_search_tool(query: str) -> dict:
    """Busca notícias no banco de dados JCPE (não na internet).

    Args:
        query: Termo de busca para encontrar notícias (título, categoria, palavras-chave).

    Returns:
        dict: {
            'status': 'success' | 'error',
            'articles': [
                {
                    'title': str,
                    'description': str (resumo),
                    'url': str (link para o site JCPE),
                    'source': 'JCPE News',
                    'category': str,
                    'author': str
                }
            ]
        }

    Exemplo:
        jcpe_search_tool("política") -> notícias de política do banco JCPE
        jcpe_search_tool("futebol") -> notícias de futebol do banco JCPE
    """
    return search_jcpe_news(query, limit=5)
