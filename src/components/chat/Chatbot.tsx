
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import OptionButtons from "./OptionButtons";
import ServiceRequestForm from "./ServiceRequestForm";
import { Message, Option, ServiceRequest, RequestType } from "@/types/chatbot";
import { 
  GREETING_MESSAGE, 
  MAIN_MENU_OPTIONS, 
  FAQ_MENU_OPTIONS,
  REQUEST_TYPE_LABELS
} from "@/constants/chatbot";
import { findFAQMatch, formatBotMessage } from "@/utils/chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [activeRequestType, setActiveRequestType] = useState<RequestType | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot with greeting
  useEffect(() => {
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content: string | React.ReactNode) => {
    addMessage({ type: "bot", content });
  };

  const addUserMessage = (content: string | React.ReactNode) => {
    addMessage({ type: "user", content });
  };

  const addSystemMessage = (content: string | React.ReactNode) => {
    addMessage({ type: "system", content });
  };

  const showMainMenu = () => {
    addSystemMessage("Please select an option:");
    setCurrentOptions(MAIN_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
  };

  const showFAQMenu = () => {
    addSystemMessage("Here are some frequently asked questions:");
    setCurrentOptions(FAQ_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
  };

  const handleOptionSelect = (option: Option) => {
    addUserMessage(option.label);
    setShowOptions(false);
    setInputDisabled(false);
    
    // Handle main menu option selection
    if (option.value === "faq") {
      showFAQMenu();
    } else if (["installation", "deinstallation", "reactivation", "maintenance"].includes(option.value)) {
      handleServiceRequestInit(option.value as RequestType);
    } else {
      // Handle FAQ option selection
      const faqMatch = findFAQMatch(option.value);
      if (faqMatch) {
        addBotMessage(faqMatch.answer);
        setTimeout(() => {
          addBotMessage("Is there anything else you'd like to know?");
          showMainMenu();
        }, 1000);
      }
    }
  };

  const handleServiceRequestInit = (requestType: RequestType) => {
    const requestName = REQUEST_TYPE_LABELS[requestType];
    
    addBotMessage(`Let's process your ${requestName} request. Please fill out the following form:`);
    setActiveRequestType(requestType);
    setShowForm(true);
    setInputDisabled(true);
  };

  const handleServiceRequestComplete = (request: ServiceRequest) => {
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    
    // Show confirmation message with ticket details
    const requestName = REQUEST_TYPE_LABELS[request.requestType];
    
    addSystemMessage(
      <div className="space-y-2">
        <p className="font-medium">✅ {requestName} Request Submitted</p>
        <p>Your service ticket has been created:</p>
        <p className="bg-brand-lightBlue p-2 rounded text-center font-bold">
          Ticket #{request.ticketNumber}
        </p>
        <p>Our team will contact {request.contactName} at {request.contactMobile} to confirm the {request.preferredDate} appointment during {request.preferredTime}.</p>
      </div>
    );

    toast({
      title: "Request Submitted",
      description: `Your ticket #${request.ticketNumber} has been created.`,
      duration: 5000,
    });
    
    setTimeout(() => {
      addBotMessage("Is there anything else I can help you with?");
      showMainMenu();
    }, 1500);
  };

  const handleServiceRequestCancel = () => {
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    
    addBotMessage("Request cancelled. How else can I assist you today?");
    showMainMenu();
  };

  const handleUserInput = (input: string) => {
    // Add user message
    addUserMessage(input);
    
    // Try to find a matching FAQ
    const faqMatch = findFAQMatch(input);
    
    if (faqMatch) {
      // Found a FAQ match
      setTimeout(() => {
        addBotMessage(faqMatch.answer);
        
        setTimeout(() => {
          addBotMessage("Is there anything else you'd like to know?");
          showMainMenu();
        }, 1000);
      }, 500);
    } else {
      // No FAQ match found
      setTimeout(() => {
        addBotMessage("I'm not sure I understand. Let me help you with one of these options:");
        showMainMenu();
      }, 500);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setShowOptions(false);
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    
    // Re-initialize chatbot
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-brand-blue text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-medium">POS Support</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRestart}
          className="text-white hover:bg-brand-blue/80"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        
        {showOptions && (
          <OptionButtons options={currentOptions} onSelect={handleOptionSelect} />
        )}
        
        {showForm && activeRequestType && (
          <ServiceRequestForm 
            requestType={activeRequestType}
            onComplete={handleServiceRequestComplete}
            onCancel={handleServiceRequestCancel}
          />
        )}
      </div>
      
      <div className="p-4 border-t bg-white rounded-b-lg">
        <ChatInput 
          onSubmit={handleUserInput} 
          disabled={inputDisabled || showForm}
          placeholder={inputDisabled ? "Please select an option above..." : "Type your question here..."}
        />
      </div>
    </div>
  );
};

export default Chatbot;
