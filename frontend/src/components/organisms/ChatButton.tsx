import React from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import './ChatButton.css';

/**
 * Botão flutuante (FAB) para abrir o chat
 * Visível apenas quando o usuário está logado
 */
const ChatButton: React.FC = () => {
  const { user } = useAuth();
  const { toggleChat } = useChat();

  // Não renderiza se o usuário não estiver logado
  if (!user) {
    return null;
  }

  return (
    <button
      className="chat-fab"
      onClick={toggleChat}
      aria-label="Abrir chat com assistente"
      type="button"
    >
      <i className="fas fa-comments" />
    </button>
  );
};

export default ChatButton;
