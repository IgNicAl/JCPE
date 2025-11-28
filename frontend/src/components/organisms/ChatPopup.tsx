import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { agentService } from '@/services/api';
import './ChatPopup.css';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  isError?: boolean;
  timestamp?: Date;
}

/**
 * Popup de chat interativo com o Assistente de IA
 * Reutiliza a lógica do AgentChat mas em formato popup
 */
const ChatPopup: React.FC = () => {
  const { user } = useAuth();
  const { isOpen, closeChat } = useChat();

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

  /**
   * Manipula o clique no overlay para fechar
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeChat();
    }
  };

  // Não renderiza se não estiver aberto ou se não houver usuário
  if (!isOpen || !user) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="chat-popup-overlay" onClick={handleOverlayClick} />

      {/* Popup */}
      <div className="chat-popup-container">
        <div className="chat-popup-box">
          {/* Cabeçalho da caixa de chat */}
          <div className="chat-popup-header">
            <div className="chat-popup-header-content">
              <div className="chat-popup-header-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="chat-popup-header-info">
                <h2>Assistente de Notícias JCPE</h2>
                <span className="chat-popup-status">
                  <span className="chat-popup-status-indicator"></span>
                  Online
                </span>
              </div>
              <button
                className="chat-popup-close"
                onClick={closeChat}
                aria-label="Fechar chat"
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Corpo principal com as mensagens */}
          <div className="chat-popup-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-popup-message ${msg.sender} message-animate`}>
                {msg.sender === 'agent' && (
                  <div className="chat-popup-message-avatar agent-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className="chat-popup-message-content">
                  <div className={`chat-popup-message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                    {msg.text}
                  </div>
                  {msg.timestamp && (
                    <span className="chat-popup-message-time">{formatTime(msg.timestamp)}</span>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="chat-popup-message-avatar user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))}

            {/* Feedback visual de "digitando..." */}
            {loading && (
              <div className="chat-popup-message agent message-animate">
                <div className="chat-popup-message-avatar agent-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="chat-popup-message-content">
                  <div className="chat-popup-message-bubble loading-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Sugestões rápidas */}
            {showSuggestions && messages.length === 1 && (
              <div className="chat-popup-quick-suggestions">
                <p className="chat-popup-suggestions-title">Sugestões para você começar:</p>
                <div className="chat-popup-suggestions-grid">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="chat-popup-suggestion-button"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      type="button"
                    >
                      <span className="chat-popup-suggestion-icon">{suggestion.icon}</span>
                      <span className="chat-popup-suggestion-text">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Div vazia para forçar a rolagem */}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulário de entrada de texto */}
          <form className="chat-popup-input-form" onSubmit={handleSubmit}>
            <div className="chat-popup-input-container">
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
    </>
  );
};

export default ChatPopup;
