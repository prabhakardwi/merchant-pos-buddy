
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chatbot";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, User, Coins } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  showCoin?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, showCoin = false }) => {
  const isBot = message.type === "bot";
  const isSystem = message.type === "system";

  return (
    <div
      className={cn(
        "flex w-full gap-3 mb-4",
        isBot || isSystem ? "justify-start" : "justify-end"
      )}
    >
      {(isBot || isSystem) && (
        <Avatar className="h-8 w-8 bg-brand-blue text-white flex items-center justify-center">
          <MessageSquare className="h-4 w-4" />
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%] animate-fade-in",
          isBot ? "bg-white border text-brand-dark shadow-sm" : 
          isSystem ? "bg-brand-lightBlue text-brand-dark" : 
          "bg-brand-blue text-white"
        )}
      >
        <div className="flex items-start gap-2">
          {showCoin && (
            <span className="inline-flex mt-1">
              <Coins className="h-4 w-4 text-yellow-500" />
            </span>
          )}
          <div>{message.content}</div>
        </div>
      </div>

      {!isBot && !isSystem && (
        <Avatar className="h-8 w-8 bg-gray-200 text-gray-600 flex items-center justify-center">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
