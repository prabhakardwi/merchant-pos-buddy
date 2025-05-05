
import React, { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import OptionButtons from "./OptionButtons";
import ServiceRequestForm from "./ServiceRequestForm";
import FeedbackInput from "./FeedbackInput";
import { Message, Option, RequestType } from "@/types/chatbot";

interface ChatBodyProps {
  messages: Message[];
  showCoins: boolean[];
  showOptions: boolean;
  currentOptions: Option[];
  handleOptionSelect: (option: Option) => void;
  showForm: boolean;
  activeRequestType: RequestType | null;
  handleServiceRequestComplete: (request: any) => void;
  handleServiceRequestCancel: () => void;
  showTextFeedback: boolean;
  textFeedback: string;
  setTextFeedback: (value: string) => void;
  handleTextFeedbackSubmit: () => void;
  showComments: boolean;
  comments: string;
  setComments: (value: string) => void;
  handleCommentsSubmit: () => void;
  inputDisabled: boolean;
}

const ChatBody: React.FC<ChatBodyProps> = ({
  messages,
  showCoins,
  showOptions,
  currentOptions,
  handleOptionSelect,
  showForm,
  activeRequestType,
  handleServiceRequestComplete,
  handleServiceRequestCancel,
  showTextFeedback,
  textFeedback,
  setTextFeedback,
  handleTextFeedbackSubmit,
  showComments,
  comments,
  setComments,
  handleCommentsSubmit,
  inputDisabled,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showTextFeedback, showComments]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 p-4 overflow-y-auto bg-gray-50"
      style={{ height: "calc(100vh - 180px)" }}
    >
      {messages.map((message, index) => (
        <ChatBubble key={message.id} message={message} showCoin={showCoins[index]} />
      ))}

      {showOptions && (
        <OptionButtons options={currentOptions} onSelect={handleOptionSelect} />
      )}

      {/* Feedback text input form */}
      {showTextFeedback && (
        <FeedbackInput
          value={textFeedback}
          onChange={setTextFeedback}
          onSubmit={handleTextFeedbackSubmit}
          onSkip={() => {
            setTextFeedback("");
            // Note: The skip logic is handled in the parent component
          }}
          title="Additional Feedback"
          placeholder="Please share your experience and suggestions..."
          coinValue={5}
        />
      )}

      {/* Comments input form */}
      {showComments && (
        <FeedbackInput
          value={comments}
          onChange={setComments}
          onSubmit={handleCommentsSubmit}
          onSkip={() => {
            setComments("");
            // Note: The skip logic is handled in the parent component
          }}
          title="Merchant Comments"
          placeholder="Please share your comments on our POS system and service..."
          coinValue={3}
          variant="blue"
        />
      )}

      {/* Service request form */}
      {showForm && activeRequestType && activeRequestType !== "installation" && (
        <ServiceRequestForm
          requestType={activeRequestType}
          onComplete={handleServiceRequestComplete}
          onCancel={handleServiceRequestCancel}
        />
      )}
    </div>
  );
};

export default ChatBody;
