"""Define e executa a equipe (Crew) de agentes de notícias.

Este módulo importa os agentes, o LLM e as tarefas, configura
a equipe (Crew) no modo hierárquico e define a função 'run_crew'
para iniciar o processo.
"""

from crewai import Crew, Task, Process
from .agents.news_agents import NewsAgents
from .services.llm_service import get_factual_llm, get_creative_llm
from .utils.errors import AgentException, ErrorCode
from .utils.output_validator import validate_llm_output
import logging

logger = logging.getLogger(__name__)


def run_crew(user_id: str, query: str) -> str:
    """Executa a equipe de agentes de notícias de forma hierárquica.

    Args:
        user_id: O ID do usuário que está fazendo a consulta.
        query: A consulta (pergunta) do usuário (já sanitizada).

    Returns:
        str: A resposta final gerada pela equipe, ou uma mensagem de erro.
    """

    # Validações
    if not user_id or not query:
        raise AgentException(
            ErrorCode.INVALID_QUERY, details=f"user_id='{user_id}', query='{query}'"
        )

    logger.info(f"🚀 Iniciando crew para user_id={user_id}, query='{query[:50]}...'")

    # 1. Instanciar LLMs especializados
    factual_llm = get_factual_llm()
    creative_llm = get_creative_llm()

    # 2. Instanciar a fábrica de Agentes com LLMs especializados
    agents_factory = NewsAgents(factual_llm=factual_llm, creative_llm=creative_llm)

    # 3. Instanciar todos os Agentes
    orchestrator_agent = agents_factory.news_orchestrator_agent()
    preference_agent = agents_factory.preference_manager_agent()
    general_agent = agents_factory.general_assistant_agent()
    politics_agent = agents_factory.politics_agent()
    sports_agent = agents_factory.sports_agent()
    technology_agent = agents_factory.technology_agent()
    economy_agent = agents_factory.economy_agent()

    # 4. Definir as Tarefas

    # Tarefa 1: Buscar perfil
    preference_task = Task(
        description=f"Buscar preferências do user_id: '{user_id}'. Retornar JSON ou 'Novo usuário'.",
        expected_output="JSON com preferências ou texto 'Novo usuário'.",
        agent=preference_agent,
    )

    # Tarefa 2: Buscar notícias
    search_task = Task(
        description=f"Buscar notícias sobre: '{query}'. Retornar lista de 3-5 artigos relevantes.",
        expected_output="Lista de artigos em formato limpo e objetivo.",
        context=[preference_task],
    )

    # Tarefa 3: Compilar resposta final
    summary_task = Task(
        description=(
            "Compilar resposta CONCISA em PT-BR.\n"
            "Formato: Título + Descrição breve + Link.\n"
            "Máximo 5 notícias.\n"
            "NÃO faça perguntas. NÃO ofereça categorias. Apenas entregue as notícias."
        ),
        expected_output="Lista formatada de notícias, máximo 10 linhas.",
        agent=orchestrator_agent,
        context=[preference_task, search_task],
    )

    # 5. Montar a Crew Hierárquica

    all_agents = [
        orchestrator_agent,
        preference_agent,
        general_agent,
        politics_agent,
        sports_agent,
        technology_agent,
        economy_agent,
    ]

    all_tasks = [preference_task, search_task, summary_task]

    crew = Crew(
        agents=all_agents,
        tasks=all_tasks,
        process=Process.hierarchical,
        manager_llm=creative_llm,  # LLM criativo para o gerente
        verbose=True,
    )

    try:
        inputs = {"user_id": user_id, "query": query}
        result = crew.kickoff(inputs=inputs)
        result_str = str(result)

        # Validação de saída
        validation = validate_llm_output(result_str)

        if not validation["is_valid"]:
            logger.warning(f"⚠️ Validação de saída falhou: {validation['violations']}")

        logger.info(f"✅ Crew concluída para user_id={user_id}")

        return validation["sanitized_text"]

    except Exception as e:
        logger.exception(f"❌ Erro na execução da crew: {e}")

        # Re-lança como AgentException se já for uma
        if isinstance(e, AgentException):
            raise

        # Caso contrário, encapsula
        raise AgentException(ErrorCode.LLM_ERROR, details=str(e), original_exception=e)
