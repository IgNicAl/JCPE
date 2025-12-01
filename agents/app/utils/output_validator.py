"""Validação de saídas do LLM."""

from typing import Dict, List
import re
import html


def validate_llm_output(text: str) -> Dict[str, any]:
    """Valida e sanitiza a saída do LLM.

    Args:
        text: Texto gerado pelo LLM

    Returns:
        dict: {
            'is_valid': bool,
            'sanitized_text': str,
            'violations': list[str],
            'original_text': str
        }
    """
    violations: List[str] = []
    sanitized = text
    original = text

    # 1. Validação de comprimento mínimo
    if len(sanitized.strip()) < 10:
        violations.append("response_too_short")

    # 2. Detecta e remove HTML tags (previne XSS)
    html_tags = re.findall(r"<[^>]+>", text)
    if html_tags:
        violations.append(f"html_tags_detected:{len(html_tags)}")
        sanitized = re.sub(r"<[^>]+>", "", sanitized)
        sanitized = html.unescape(sanitized)

    # 3. Detecta scripts inline
    if re.search(r"(javascript:|on\w+\s*=|<\s*script)", text, re.IGNORECASE):
        violations.append("script_detected")
        sanitized = re.sub(
            r"(javascript:|on\w+\s*=)", "", sanitized, flags=re.IGNORECASE
        )

    # 4. Normaliza espaços em branco
    sanitized = re.sub(r"\s+", " ", sanitized).strip()

    # 5. Verifica estrutura mínima de resposta
    if not sanitized or len(sanitized) < 20:
        violations.append("invalid_structure")

    return {
        "is_valid": len(
            [v for v in violations if v.startswith(("script", "excessive"))]
        )
        == 0,
        "sanitized_text": sanitized,
        "violations": violations,
        "original_text": original,
    }
