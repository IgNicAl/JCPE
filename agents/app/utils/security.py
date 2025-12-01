"""Módulo de segurança para validação e sanitização de inputs."""

import re
from typing import Dict, List
import html


# Padrões de prompt injection conhecidos
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous\s+)?(instructions?|prompts?|rules?)",
    r"forget\s+(all\s+)?(previous|everything)",
    r"you\s+are\s+(now|a)\s+",
    r"system[\s:]",
    r"<\s*/?\s*script",
    r"(DROP|DELETE|UPDATE|INSERT|SELECT)\s+(FROM|INTO|TABLE)",
    r"<\s*iframe",
    r"javascript:",
    r"on(load|error|click)\s*=",
]


def sanitize_user_query(query: str, max_length: int = 500) -> Dict[str, any]:
    """Sanitiza e valida query do usuário.

    Args:
        query: Consulta do usuário
        max_length: Comprimento máximo permitido

    Returns:
        dict: {
            'is_safe': bool,
            'sanitized_query': str,
            'detected_threats': list[str],
            'original_query': str
        }
    """
    threats: List[str] = []
    sanitized = query.strip()

    # 1. Validação de comprimento
    if len(sanitized) > max_length:
        threats.append(f"query_too_long:{len(sanitized)}>{max_length}")
        sanitized = sanitized[:max_length]

    # 2. Validação de conteúdo vazio
    if not sanitized:
        threats.append("empty_query")
        return {
            "is_safe": False,
            "sanitized_query": "",
            "detected_threats": threats,
            "original_query": query,
        }

    # 3. Detecção de padrões de injection
    for pattern in INJECTION_PATTERNS:
        matches = re.findall(pattern, query, re.IGNORECASE)
        if matches:
            threats.append(f"injection_pattern_detected")

    # 4. Escapa caracteres HTML perigosos
    sanitized = html.escape(sanitized)

    # 5. Remove múltiplos espaços em branco
    sanitized = re.sub(r"\s+", " ", sanitized)

    # 6. Se seguro, aplica delimitadores XML para isolamento
    if not threats:
        sanitized = f"<user_query>{sanitized}</user_query>"

    return {
        "is_safe": len(threats) == 0,
        "sanitized_query": sanitized,
        "detected_threats": threats,
        "original_query": query,
    }


def validate_user_id(user_id: str) -> bool:
    """Valida formato de UUID.

    Args:
        user_id: String UUID

    Returns:
        True se válido, False caso contrário
    """
    uuid_pattern = r"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$"
    return bool(re.match(uuid_pattern, user_id, re.IGNORECASE))
