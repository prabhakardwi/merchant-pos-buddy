
import { useState } from "react";
import { InstallationStep } from "@/types/chatbot";

const useChatUIState = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showTextFeedback, setShowTextFeedback] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<string>("");

  // Generate appropriate placeholder text based on current state
  const getInputPlaceholder = (
    expectedInput: string,
    inputDisabled: boolean,
    showTextFeedback: boolean,
    showComments: boolean
  ) => {
    if (expectedInput === "merchantId") return "Enter your Merchant ID...";
    if (expectedInput === "otpVerification") return "Enter the OTP code...";
    if (showTextFeedback) return "Type your feedback...";
    if (showComments) return "Type your comments...";
    if (inputDisabled) return "Please select an option above...";
    return "Type your question here...";
  };

  // Calculate whether the input should be disabled
  const isInputDisabled = (
    baseDisabled: boolean,
    showForm: boolean,
    showTextFeedback: boolean,
    textFeedback: string,
    showComments: boolean,
    comments: string
  ) => {
    return (
      baseDisabled ||
      showForm ||
      (showTextFeedback && !textFeedback.trim()) ||
      (showComments && !comments.trim())
    );
  };

  return {
    showForm,
    setShowForm,
    showTextFeedback,
    setShowTextFeedback,
    textFeedback,
    setTextFeedback,
    showComments,
    setShowComments,
    comments,
    setComments,
    getInputPlaceholder,
    isInputDisabled,
  };
};

export default useChatUIState;
