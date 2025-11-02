"""Define a classe 'NewsAgents' que constrói e configura os agentes da equipe (Crew).

Este módulo contém os métodos para instanciar:
- O Agente Gerente (Orquestrador)
- Agentes de utilidade (Preferências, Assistente Geral)
- Agentes especialistas (Política, Esportes, etc.)

A lógica de criação dos agentes especialistas foi refatorada usando a
função-fábrica _create_specialist_agent para seguir o princípio DRY.
"""

from crewai import Agent
from app.tools.toolkit import db_tool, news_search_tool
from langchain_google_genai import ChatGoogleGenerativeAI # Importar o tipo do LLM

# Define as ferramentas que serão distribuídas aos agentes
db_utility_tool = db_tool
search_utility_tool = news_search_tool


def _create_specialist_agent(role: str, goal: str, backstory: str, llm: ChatGoogleGenerativeAI) -> Agent:
    """Fábrica interna para criar agentes especialistas em notícias.

    Esta função consolida a lógica repetida de configuração dos agentes
    especialistas, aplicando a ferramenta de busca e configurações comuns.

    Args:
        role: O papel (função) do agente.
        goal: O objetivo principal do agente.
        backstory: A história de fundo (contexto) do agente.
        llm: A instância do LLM (ChatGoogleGenerativeAI) a ser usada.

    Returns:
        Um objeto Agent configurado.
    """
    return Agent(
        role=role,
        goal=goal,
        backstory=backstory,
        tools=[search_utility_tool],
        llm=llm,  # <-- Injeta o LLM explicitamente
        verbose=True,
        allow_delegation=False
    )


class NewsAgents:
    """Fábrica de agentes para a equipe de notícias.

    Contém métodos para instanciar todos os agentes necessários para a
    execução da equipe (Crew).
    """

    def __init__(self, llm: ChatGoogleGenerativeAI):
        """Inicializa a fábrica de agentes com um LLM específico.

        Args:
            llm: A instância do LLM (ex: ChatGoogleGenerativeAI)
                 a ser usada por todos os agentes criados por esta fábrica.
        """
        self.llm = llm

    def preference_manager_agent(self) -> Agent:
        """Cria o agente responsável por analisar preferências do usuário.

        Returns:
            Agent: O agente Gerenciador de Preferências.
        """
        return Agent(
            role="Gerenciador de Preferências de Usuário",
            goal="Analisar o histórico e as preferências de um usuário (user_id) para extrair tópicos de interesse e contexto.",
            backstory=(
                "Você é um especialista em análise de dados de usuários. Sua função é examinar as preferências salvas "
                "de um usuário (usando o db_tool) para identificar temas e palavras-chave que guiarão a busca por notícias."
            ),
            tools=[db_utility_tool],
            llm=self.llm,  # <-- Injeta o LLM explicitamente
            verbose=True,
            allow_delegation=False
        )

    def news_orchestrator_agent(self) -> Agent:
        """Cria o agente Gerente (Orquestrador) da equipe.

        Returns:
            Agent: O agente Orquestrador de Notícias (manager).
        """
        return Agent(
            role="Orquestrador de Notícias e Redator Chefe (Gerente)",
            goal=(
                "Coordenar todo o processo de atendimento ao usuário. Primeiro, entender o perfil do usuário (delegando ao Gerenciador de Preferências). "
                "Segundo, analisar a query do usuário e o perfil para ROTEIRIZAR a tarefa para o Agente Especialista correto (ex: Política, Esportes, etc.). "
                "Se a query for vaga ou não se encaixar, delegue ao 'Assistente Geral'. "
                "Finalmente, compilar os resultados em uma resposta final coesa em PT-BR."
            ),
            backstory=(
                "Você é o editor-chefe e gerente desta equipe. Você recebe a consulta, busca contexto interno, "
                "e delega a busca de notícias ao especialista apropriado da sua equipe. Você é o único que fala com o usuário."
            ),
            llm=self.llm,  # <-- Injeta o LLM explicitamente
            verbose=True,
            allow_delegation=True
        )

    def general_assistant_agent(self) -> Agent:
        """Cria o agente de fallback para consultas vagas.

        Returns:
            Agent: O agente Assistente Geral.
        """
        return Agent(
            role="Assistente Geral de Conversação",
            goal="Interagir com o usuário quando a consulta for vaga, ambígua ou não se encaixar em nenhuma categoria especializada. Fazer perguntas claras para ajudar o usuário a decidir.",
            backstory=(
                "Você é o assistente amigável da recepção. Se um usuário não sabe o que quer (ex: 'não sei', 'estou entediado'), "
                "seu trabalho é conversar com ele, perguntar sobre seus interesses (ex: 'Você prefere Esportes, Política ou Tecnologia?') "
                "e guiar o usuário para uma escolha."
            ),
            tools=[],
            llm=self.llm,  # <-- Injeta o LLM explicitamente
            verbose=True,
            allow_delegation=False
        )

    # --- Agentes Especialistas (Refatorados com DRY) ---

    def politics_agent(self) -> Agent:
        """Cria o agente especialista em Política.

        Returns:
            Agent: O agente especialista.
        """
        return _create_specialist_agent(
            role="Especialista em Notícias de Política",
            goal="Buscar, filtrar e resumir as notícias mais relevantes sobre política, eleições, governo e diplomacia.",
            backstory="Você é um jornalista veterano focado exclusivamente na cobertura política. Você usa o 'news_search_tool' para encontrar informações precisas.",
            llm=self.llm  # <-- Passa o LLM para a função-fábrica
        )

    def sports_agent(self) -> Agent:
        """Cria o agente especialista em Esportes.

        Returns:
            Agent: O agente especialista.
        """
        return _create_specialist_agent(
            role="Especialista em Notícias de Esportes",
            goal="Buscar, filtrar e resumir as notícias mais relevantes sobre jogos, campeonatos, atletas e resultados esportivos.",
            backstory="Você é um comentarista esportivo ágil. Você usa o 'news_search_tool' para obter os últimos resultados e análises.",
            llm=self.llm  # <-- Passa o LLM para a função-fábrica
        )

    def technology_agent(self) -> Agent:
        """Cria o agente especialista em Tecnologia.

        Returns:
            Agent: O agente especialista.
        """
        return _create_specialist_agent(
            role="Especialista em Notícias de Tecnologia",
            goal="Buscar, filtrar e resumir as notícias mais relevantes sobre startups, gadgets, IA, cibersegurança e ciência.",
            backstory="Você é um analista de tendências tecnológicas. Você usa o 'news_search_tool' para encontrar os últimos lançamentos e inovações.",
            llm=self.llm  # <-- Passa o LLM para a função-fábrica
        )

    def economy_agent(self) -> Agent:
        """Cria o agente especialista em Economia.

        Returns:
            Agent: O agente especialista.
        """
        return _create_specialist_agent(
            role="Especialista em Notícias de Economia",
            goal="Buscar, filtrar e resumir as notícias mais relevantes sobre mercado de ações, finanças, negócios e tendências econômicas.",
            backstory="Você é um analista financeiro experiente. Você usa o 'news_search_tool' para monitorar o mercado e identificar sinais importantes.",
            llm=self.llm  # <-- Passa o LLM para a função-fábrica
        )
