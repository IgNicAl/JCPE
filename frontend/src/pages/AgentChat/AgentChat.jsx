import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { agentService } from '@/services/api';
import './AgentChat.css';

/**
 * Renderiza a página de chat interativo com o Assistente de IA.
 * * O usuário deve estar logado para acessar esta página.
 * O componente gerencia o estado das mensagens, a entrada do usuário
 * e a comunicação com a API do agente.
 *
 * @returns {JSX.Element} A interface de chat.
 */
export default function AgentChat() {
  const { user } = useAuth(); // Pega o usuário logado do contexto

  // Estado para armazenar o histórico de mensagens
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: `Olá, ${user?.name || 'usuário'}! Sou seu assistente de notícias. Sobre o que você gostaria de saber hoje? (Ex: "notícias de política", "jogos de hoje", "economia")`,
    },
  ]);

  // Estado para o campo de input
  const [input, setInput] = useState('');
  // Estado para feedback visual (loading)
  const [loading, setLoading] = useState(false);
  // Estado para mensagens de erro
  const [error, setError] = useState('');

  // Referência para o final do container de mensagens, para rolar automaticamente
  const messagesEndRef = useRef(null);

  /**
   * Efeito que rola a tela para a última mensagem
   * sempre que o array 'messages' é atualizado.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Manipula o envio do formulário de chat.
   * @param {React.FormEvent} e - O evento do formulário.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return; // Não envia se estiver vazio ou carregando

    // Adiciona a mensagem do usuário ao estado
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Chama o serviço da API do agente com o ID do usuário e a pergunta
      const response = await agentService.chat(user.id, input);

      // Adiciona a resposta do agente ao estado
      const agentMessage = {
        sender: 'agent',
        text: response.data.response || 'Não consegui processar sua resposta.',
      };
      setMessages((prev) => [...prev, agentMessage]);

    } catch (err) {
      console.error("Erro ao contatar o agente:", err);
      const errorMsg = 'Desculpe, não consegui me conectar ao assistente. Tente novamente.'
      setError(errorMsg);
      // Adiciona a mensagem de erro ao chat para feedback
      setMessages((prev) => [...prev, { sender: 'agent', text: errorMsg, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-box-container">
        {/* Cabeçalho da caixa de chat */}
        <div className="chat-header">
          <h2>Assistente de Notícias jcpe</h2>
          <span>Online</span>
        </div>

        {/* Corpo principal com as mensagens */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Feedback visual de "digitando..." */}
          {loading && (
            <div className="message agent">
              <div className="message-bubble loading-bubble">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          {/* Div vazia para forçar a rolagem */}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulário de entrada de texto */}
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={loading}
            aria-label="Digite sua pergunta"
          />
          <button type="submit" disabled={loading} aria-label="Enviar mensagem">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
