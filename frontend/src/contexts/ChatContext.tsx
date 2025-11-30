import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

/**
 * Provider para gerenciar o estado global do popup de chat
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Hook para acessar o contexto do chat
 */
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};
