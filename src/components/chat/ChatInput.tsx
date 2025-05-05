
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSubmit, 
  placeholder = "Type your message here...", 
  disabled = false 
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 mt-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-grow shadow-sm border border-gray-200"
      />
      <Button 
        type="submit" 
        disabled={disabled || !input.trim()}
        className="bg-brand-blue hover:bg-brand-blue/90"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
