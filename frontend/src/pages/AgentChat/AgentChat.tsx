import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { agentService } from '@/services/api';
import './AgentChat.css';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  isError?: boolean;
  timestamp?: Date;
}

/**
 * Renderiza a página de chat interativo com o Assistente de IA.
 * O usuário deve estar logado para acessar esta página.
 * O componente gerencia o estado das mensagens, a entrada do usuário
 * e a comunicação com a API do agente.
 */
const AgentChat: React.FC = () => {
  const { user } = useAuth();

  // Estado para armazenar o histórico de mensagens
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: `Olá, ${user?.name || 'usuário'}! 👋 Sou seu assistente inteligente de notícias do JCPE. Estou aqui para ajudá-lo a encontrar as informações mais relevantes e atualizadas.`,
      timestamp: new Date(),
    },
  ]);

  // Estado para o campo de input
  const [input, setInput] = useState<string>('');
  // Estado para feedback visual (loading)
  const [loading, setLoading] = useState<boolean>(false);
  // Estado para controlar se mostra sugestões
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  // Referência para o final do container de mensagens, para rolar automaticamente
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sugestões rápidas para o usuário
  const quickSuggestions = [
    { icon: '📰', text: 'Últimas notícias de política' },
    { icon: '⚽', text: 'Resultados dos jogos de hoje' },
    { icon: '💰', text: 'Notícias de economia' },
    { icon: '🌍', text: 'Notícias internacionais' },
  ];

  /**
   * Efeito que rola a tela para a última mensagem
   * sempre que o array 'messages' é atualizado.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Manipula o envio do formulário de chat.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading || !user?.id) return;

    sendMessage(input);
  };

  /**
   * Envia uma mensagem para o agente
   */
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading || !user?.id) return;

    setShowSuggestions(false);

    // Adiciona a mensagem do usuário ao estado
    const userMessage: Message = {
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Chama o serviço da API do agente com o ID do usuário e a pergunta
      const response = await agentService.chat(user.id, messageText);

      // Adiciona a resposta do agente ao estado
      const agentMessage: Message = {
        sender: 'agent',
        text: response.data?.response || 'Não consegui processar sua resposta.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error('Erro ao contatar o agente:', err);
      const errorMsg =
        'Desculpe, não consegui me conectar ao assistente no momento. Por favor, tente novamente em alguns instantes. 🔄';
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: errorMsg, isError: true, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  /**
   * Manipula o clique em uma sugestão rápida
   */
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  /**
   * Formata o horário da mensagem
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-page-container">
      <div className="chat-box-container">
        {/* Cabeçalho da caixa de chat */}
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-header-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="chat-header-info">
              <h2>Assistente de Notícias JCPE</h2>
              <span className="chat-status">
                <span className="status-indicator"></span>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Corpo principal com as mensagens */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender} message-animate`}>
              {msg.sender === 'agent' && (
                <div className="message-avatar agent-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              <div className="message-content">
                <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="message-avatar user-avatar">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))}

          {/* Feedback visual de "digitando..." */}
          {loading && (
            <div className="message agent message-animate">
              <div className="message-avatar agent-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content">
                <div className="message-bubble loading-bubble">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          {/* Sugestões rápidas */}
          {showSuggestions && messages.length === 1 && (
            <div className="quick-suggestions">
              <p className="suggestions-title">Sugestões para você começar:</p>
              <div className="suggestions-grid">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    type="button"
                  >
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <span className="suggestion-text">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Div vazia para forçar a rolagem */}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulário de entrada de texto */}
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua pergunta..."
              disabled={loading}
              aria-label="Digite sua pergunta"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Enviar mensagem">
              <i className={loading ? 'fas fa-circle-notch fa-spin' : 'fas fa-paper-plane'}></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentChat;

