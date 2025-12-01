"""Métricas e observabilidade do sistema."""

from prometheus_client import Counter, Histogram, Gauge, generate_latest
import time
import logging
from functools import wraps
from typing import Callable

logger = logging.getLogger(__name__)

# Contadores
requests_total = Counter(
    "jcpe_requests_total", "Total de requisições", ["endpoint", "status"]
)

llm_calls_total = Counter(
    "jcpe_llm_calls_total", "Total de chamadas ao LLM", ["model", "status"]
)

cache_operations = Counter(
    "jcpe_cache_operations_total",
    "Operações de cache",
    [
        "operation",
        "result",
    ],  # operation: get/set/delete, result: hit/miss/success/error
)

# Histogramas (latência)
request_duration = Histogram(
    "jcpe_request_duration_seconds", "Duração das requisições", ["endpoint"]
)

llm_duration = Histogram(
    "jcpe_llm_duration_seconds", "Duração das chamadas ao LLM", ["model"]
)

crew_execution_duration = Histogram(
    "jcpe_crew_execution_duration_seconds", "Duração da execução da crew"
)

# Gauges (estado atual)
active_requests = Gauge("jcpe_active_requests", "Requisições ativas no momento")

user_preferences_cached = Gauge(
    "jcpe_user_preferences_cached", "Preferências de usuário em cache"
)


def track_request(endpoint: str):
    """Decorator para rastrear métricas de requisições."""

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            active_requests.inc()
            start_time = time.time()
            status = "success"

            try:
                result = await func(*args, **kwargs)
                return result
            except Exception as e:
                status = "error"
                raise
            finally:
                duration = time.time() - start_time
                active_requests.dec()
                requests_total.labels(endpoint=endpoint, status=status).inc()
                request_duration.labels(endpoint=endpoint).observe(duration)

                logger.info(
                    f"📊 Métricas: endpoint={endpoint}, "
                    f"status={status}, duration={duration:.2f}s"
                )

        return wrapper

    return decorator


def track_llm_call(model: str):
    """Decorator para rastrear chamadas ao LLM."""

    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            status = "success"

            try:
                result = func(*args, **kwargs)
                return result
            except Exception as e:
                status = "error"
                raise
            finally:
                duration = time.time() - start_time
                llm_calls_total.labels(model=model, status=status).inc()
                llm_duration.labels(model=model).observe(duration)

                logger.debug(
                    f"🤖 LLM Call: model={model}, "
                    f"status={status}, duration={duration:.2f}s"
                )

        return wrapper

    return decorator


def track_cache_operation(operation: str, result: str):
    """Registra operação de cache.

    Args:
        operation: Tipo de operação (get, set, delete)
        result: Resultado (hit, miss, success, error)
    """
    cache_operations.labels(operation=operation, result=result).inc()


def get_metrics() -> bytes:
    """Retorna métricas no formato Prometheus.

    Returns:
        Métricas em formato texto
    """
    return generate_latest()
