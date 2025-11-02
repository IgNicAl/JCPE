"""Define e executa a equipe (Crew) de agentes de notícias.

Este módulo importa os agentes, o LLM e as tarefas, configura
a equipe (Crew) no modo hierárquico e define a função 'run_crew'
para iniciar o processo.
"""

from crewai import Crew, Task, Process
from .agents.news_agents import NewsAgents
from .services.llm_service import get_llm


def run_crew(user_id: str, query: str) -> str:
    """Executa a equipe de agentes de notícias de forma hierárquica.

    Args:
        user_id: O ID do usuário que está fazendo a consulta.
        query: A consulta (pergunta) do usuário.

    Returns:
        str: A resposta final gerada pela equipe, ou uma mensagem de erro.
    """

    # 1. Instanciar o LLM
    llm = get_llm()

    # 2. Instanciar a fábrica de Agentes, INJETANDO o LLM
    agents_factory = NewsAgents(llm=llm)

    # 3. Instanciar todos os Agentes (agora eles receberão o LLM no construtor)
    orchestrator_agent = agents_factory.news_orchestrator_agent()
    preference_agent = agents_factory.preference_manager_agent()
    general_agent = agents_factory.general_assistant_agent()
    politics_agent = agents_factory.politics_agent()
    sports_agent = agents_factory.sports_agent()
    technology_agent = agents_factory.technology_agent()
    economy_agent = agents_factory.economy_agent()

    # (Instancie todos os outros agentes especialistas que você criou)

    # 4. Definir as Tarefas

    # Tarefa 1: Buscar perfil
    preference_task = Task(
        description=f"Buscar o perfil de preferências para o user_id: '{user_id}'.",
        expected_output="Um resumo em texto das preferências do usuário (ou 'nenhuma preferência encontrada').",
        agent=preference_agent
    )

    # Tarefa 2: Buscar notícias (Flutuante - será delegada pelo gerente)
    search_task = Task(
        description=f"Com base na consulta do usuário: '{query}', encontrar as notícias relevantes OU fazer uma pergunta de esclarecimento.",
        expected_output="Uma lista de artigos de notícias (JSON) OU uma pergunta de esclarecimento para o usuário.",
        context=[preference_task]
        # O agente desta tarefa será definido pelo gerente
    )

    # Tarefa 3: Compilar e resumir (Gerente)
    summary_task = Task(
        description=(
            "Usando o perfil do usuário (da 'preference_task') e o resultado da 'search_task' (que pode ser artigos ou uma pergunta), "
            "gere uma resposta final coesa, amigável e personalizada em PT-BR."
        ),
        expected_output="Um resumo formatado (PT-BR) das notícias OU a pergunta de esclarecimento, pronto para o usuário.",
        agent=orchestrator_agent,
        context=[preference_task, search_task]
    )

    # 5. Montar a Crew Hierárquica

    all_agents = [
        orchestrator_agent,
        preference_agent,
        general_agent,
        politics_agent,
        sports_agent,
        technology_agent,
        economy_agent
        # (Adicione todos os outros especialistas aqui)
    ]

    all_tasks = [
        preference_task,
        search_task,
        summary_task
    ]

    crew = Crew(
        agents=all_agents,
        tasks=all_tasks,
        process=Process.hierarchical,
        llm=llm,  # LLM para os agentes trabalhadores
        manager_llm=llm,  # LLM para o gerente
        verbose=2
    )

    try:
        inputs = {'user_id': user_id, 'query': query}
        result = crew.kickoff(inputs=inputs)

        return str(result)

    except Exception as e:
        print(f"Erro na execução da equipe: {e}")
        return "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
