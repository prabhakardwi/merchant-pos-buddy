
import React from "react";
import ChatInput from "./ChatInput";

interface ChatFooterProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
  placeholder: string;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  onSubmit,
  disabled,
  placeholder,
}) => {
  return (
    <div className="p-4 border-t bg-white rounded-b-lg">
      <ChatInput
        onSubmit={onSubmit}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ChatFooter;
