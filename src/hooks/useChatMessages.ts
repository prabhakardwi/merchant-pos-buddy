
import { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { Message, MessageType } from '@/types/chatbot';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCoins, setShowCoins] = useState<boolean[]>([]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">, showCoin: boolean = false) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (showCoin) {
      setShowCoins(prev => [...prev, true]);
    } else {
      setShowCoins(prev => [...prev, false]);
    }
  };

  const addBotMessage = (content: string | React.ReactNode, showCoin: boolean = false) => {
    addMessage({ type: "bot", content }, showCoin);
  };

  const addUserMessage = (content: string | React.ReactNode) => {
    addMessage({ type: "user", content });
  };

  const addSystemMessage = (content: string | React.ReactNode, showCoin: boolean = false) => {
    addMessage({ type: "system", content }, showCoin);
  };

  const clearMessages = () => {
    setMessages([]);
    setShowCoins([]);
  };

  return {
    messages,
    showCoins,
    addBotMessage,
    addUserMessage,
    addSystemMessage,
    clearMessages
  };
};
