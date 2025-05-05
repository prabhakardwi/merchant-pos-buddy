import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, Option } from "@/types/chatbot";

const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [expectedInput, setExpectedInput] = useState<string>("");
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

  return {
    messages,
    setMessages,
    showOptions,
    setShowOptions,
    currentOptions,
    setCurrentOptions,
    inputDisabled,
    setInputDisabled,
    expectedInput,
    setExpectedInput,
    showCoins,
    setShowCoins,
    addMessage,
    addBotMessage,
    addUserMessage,
    addSystemMessage
  };
};

export default useChatState;
