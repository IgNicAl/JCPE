"""Ferramenta de busca de notícias integrada com a NewsAPI.

Este módulo configura o cliente da NewsAPI usando a API Key fornecida
pelas variáveis de ambiente (carregadas pelo main.py).

Fornece a função 'search_news' que será usada como ferramenta pelos agentes.
"""

import os
from newsapi import NewsApiClient

# Carrega a API Key (fornecida pelo main.py)
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

if not NEWS_API_KEY:
    raise ValueError("Variável de ambiente NEWS_API_KEY não definida.")

# Instancia o cliente da API
newsapi = NewsApiClient(api_key=NEWS_API_KEY)


def search_news(query: str, language: str = 'pt', page_size: int = 5) -> dict:
    """Busca artigos de notícias recentes usando a NewsAPI.

    Args:
        query: O tópico de busca (ex: "Inteligência Artificial").
        language: O idioma da busca (padrão: 'pt').
        page_size: O número máximo de artigos a retornar (padrão: 5).

    Returns:
        dict: Um dicionário contendo o status ("success" ou "error") e,
              em caso de sucesso, uma lista de artigos.
    """
    try:
        # Busca por tudo, ordenado por relevância
        all_articles = newsapi.get_everything(
            q=query,
            language=language,
            sort_by='relevancy',
            page_size=page_size
        )

        if all_articles['status'] == 'ok':
            # Formata a saída para ser mais limpa para o agente
            articles = [
                {
                    "title": article.get("title", "N/A"),
                    "description": article.get("description", "N/A"),
                    "url": article.get("url", "N/A"),
                    "source": article.get("source", {}).get("name", "N/A")
                }
                for article in all_articles.get("articles", [])
            ]
            return {"status": "success", "articles": articles}
        else:
            return {"status": "error", "message": all_articles.get('message', 'Erro desconhecido da NewsAPI')}

    except Exception as e:
        print(f"Erro ao buscar notícias para a query '{query}': {e}")
        return {"status": "error", "message": str(e)}
