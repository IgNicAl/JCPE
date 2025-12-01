"""Deduplicação de artigos de notícias."""

from typing import List, Dict
from difflib import SequenceMatcher
import hashlib


def calculate_similarity(str1: str, str2: str) -> float:
    """Calcula similaridade entre duas strings usando SequenceMatcher.

    Args:
        str1: Primeira string
        str2: Segunda string

    Returns:
        Valor entre 0 (totalmente diferentes) e 1 (idênticas)
    """
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()


def get_article_hash(article: Dict) -> str:
    """Gera hash único para um artigo baseado em título e URL.

    Args:
        article: Dicionário com dados do artigo

    Returns:
        Hash MD5 do título + URL
    """
    content = f"{article.get('title', '')}|{article.get('url', '')}"
    return hashlib.md5(content.encode()).hexdigest()


def deduplicate_articles(
    articles: List[Dict], similarity_threshold: float = 0.85, use_hash: bool = True
) -> List[Dict]:
    """Remove artigos duplicados da lista.

    Args:
        articles: Lista de artigos com campos 'title' e 'url'
        similarity_threshold: Limite de similaridade para considerar duplicata (0-1)
        use_hash: Se True, usa hash exato; se False, usa similaridade fuzzy

    Returns:
        Lista de artigos únicos
    """
    if not articles:
        return []

    if use_hash:
        # Método rápido: deduplicação por hash
        seen_hashes = set()
        unique_articles = []

        for article in articles:
            article_hash = get_article_hash(article)

            if article_hash not in seen_hashes:
                seen_hashes.add(article_hash)
                unique_articles.append(article)

        return unique_articles

    else:
        # Método fuzzy: deduplicação por similaridade de título
        unique_articles = [articles[0]]

        for article in articles[1:]:
            is_duplicate = False

            for unique in unique_articles:
                similarity = calculate_similarity(
                    article.get("title", ""), unique.get("title", "")
                )

                if similarity >= similarity_threshold:
                    is_duplicate = True
                    break

            if not is_duplicate:
                unique_articles.append(article)

        return unique_articles
