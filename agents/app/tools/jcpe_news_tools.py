"""Ferramenta para buscar notícias do backend JCPE."""

import requests
import logging
from typing import Dict

logger = logging.getLogger(__name__)

BACKEND_URL = "http://localhost:8080/api"


def search_jcpe_news(query: str, limit: int = 5) -> Dict:
    """Busca notícias do banco de dados JCPE via API REST.

    Args:
        query: Termo de busca (título, resumo, categoria)
        limit: Número máximo de resultados (padrão: 5)

    Returns:
        dict: {
            'status': 'success' | 'error',
            'articles': list[dict] | None,
            'message': str | None
        }
    """
    try:
        # Busca TODAS as notícias publicadas (paginação máxima)
        response = requests.get(
            f"{BACKEND_URL}/noticias",
            timeout=10,
        )

        if response.status_code == 200:
            data = response.json()

            # O backend retorna PagedResponse com content
            noticias = data.get("content", []) if isinstance(data, dict) else data

            # Busca case-insensitive
            query_lower = query.lower()

            # Formata para o padrão esperado pelos agentes
            articles = []
            for noticia in noticias:
                title = noticia.get("title", "")
                summary = noticia.get("summary", "")

                # Busca na categoria principal
                category = noticia.get("category", {})
                category_name = (
                    category.get("name", "") if isinstance(category, dict) else ""
                )

                # Busca nas TAGS (subcategorias)
                tags = noticia.get("tags", [])
                tags_text = " ".join(
                    [tag.get("name", "") for tag in tags if isinstance(tag, dict)]
                )

                # Verifica se a query está em: título, resumo, categoria OU tags
                if (
                    query_lower in title.lower()
                    or query_lower in summary.lower()
                    or query_lower in category_name.lower()
                    or query_lower in tags_text.lower()
                ):
                    articles.append(
                        {
                            "title": title,
                            "description": summary,
                            "url": f"http://localhost:3000/noticia/{noticia.get('slug', '')}",
                            "source": "JCPE News",
                            "published_at": noticia.get("publicationDate", "N/A"),
                            "category": category_name,
                            "tags": tags_text,
                            "author": noticia.get("author", {}).get("username", "JCPE")
                            if isinstance(noticia.get("author"), dict)
                            else "JCPE",
                            "image": noticia.get("featuredImageUrl", ""),
                        }
                    )

            logger.info(
                f"✅ Encontradas {len(articles)} notícias no banco JCPE para query='{query}'"
            )

            # Se não encontrou nada, retorna as 5 últimas notícias
            if not articles:
                logger.warning(
                    f"Nenhuma notícia encontrada para '{query}', retornando últimas notícias"
                )
                for noticia in noticias[:limit]:
                    category = noticia.get("category", {})
                    articles.append(
                        {
                            "title": noticia.get("title", ""),
                            "description": noticia.get("summary", ""),
                            "url": f"http://localhost:3000/noticia/{noticia.get('slug', '')}",
                            "source": "JCPE News",
                            "published_at": noticia.get("publicationDate", "N/A"),
                            "category": category.get("name", "")
                            if isinstance(category, dict)
                            else "",
                            "author": noticia.get("author", {}).get("username", "JCPE")
                            if isinstance(noticia.get("author"), dict)
                            else "JCPE",
                        }
                    )

            return {
                "status": "success",
                "articles": articles[:limit],
                "total": len(articles),
            }

        else:
            logger.warning(f"⚠️ Backend retornou status {response.status_code}")
            return {
                "status": "error",
                "message": f"Erro ao buscar notícias: {response.status_code}",
                "articles": [],
            }

    except requests.exceptions.ConnectionError:
        logger.error("❌ Não foi possível conectar ao backend JCPE em localhost:8080")
        return {
            "status": "error",
            "message": "Backend JCPE não está acessível. Verifique se está rodando na porta 8080.",
            "articles": [],
        }

    except Exception as e:
        logger.exception(f"❌ Erro ao buscar notícias do JCPE: {e}")
        return {"status": "error", "message": str(e), "articles": []}


def search_jcpe_news_by_category(category: str, limit: int = 5) -> Dict:
    """Busca notícias de uma categoria específica.

    Args:
        category: Nome da categoria (Política, Esportes, Tecnologia, etc.)
        limit: Número máximo de resultados

    Returns:
        dict com status e lista de artigos
    """
    # Por enquanto, usa a função principal com o nome da categoria como query
    return search_jcpe_news(category, limit)
