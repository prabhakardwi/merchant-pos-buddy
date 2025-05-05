
import { useState } from "react";
import { Option, InstallationStep, POSType } from "@/types/chatbot";
import { findFAQMatch } from "@/utils/chatbot";

interface ChatOptionHandlersProps {
  installationStep: InstallationStep;
  setInstallationStep: (step: InstallationStep) => void;
  handleInstallationFlow: (input: string) => void;
  handlePOSTypeSelection: (posType: POSType) => void;
  handleTimeSlotSelection: (timeSlot: string) => void;
  setOtp: (otp: string) => void;
  currentFeedbackQuestion: number;
  setFeedbackData: (callback: (prev: any) => any) => void;
  handleFeedbackQuestion: () => void;
  setCurrentFeedbackQuestion: (question: number) => void;
  addBotMessage: (message: string | React.ReactNode, showCoin?: boolean) => void;
  showMainMenu: () => void;
}

const useChatOptionHandlers = ({
  installationStep,
  setInstallationStep,
  handleInstallationFlow,
  handlePOSTypeSelection,
  handleTimeSlotSelection,
  setOtp,
  currentFeedbackQuestion,
  setFeedbackData,
  handleFeedbackQuestion,
  setCurrentFeedbackQuestion,
  addBotMessage,
  showMainMenu,
}: ChatOptionHandlersProps) => {
  // Handler for specific option selection based on current step
  const handleSpecificOptionSelection = (option: Option): boolean => {
    // Merchant confirmation step
    if (installationStep === "confirmMerchant") {
      if (option.value === "yes") {
        const { generateOTP } = require("@/utils/chatbot");
        const newOtp = generateOTP();
        setOtp(newOtp);
        setTimeout(() => {
          addBotMessage(`Great! To verify your identity, we've sent a one-time password (OTP) to the registered mobile number. For this demo, your OTP is: ${newOtp}`);
          addBotMessage("Please enter the OTP to proceed:");
          setInstallationStep("otpVerification");
        }, 1000);
        return true;
      } else if (option.value === "no") {
        setTimeout(() => {
          addBotMessage("Let's try again. Please enter your Merchant ID:");
          setInstallationStep("merchantId");
        }, 1000);
        return true;
      }
    }
    
    // POS type selection step
    else if (installationStep === "posTypeSelection" && (option.value === "APOS" || option.value === "ClassicPOS")) {
      handlePOSTypeSelection(option.value as POSType);
      return true;
    }
    
    // Time slot selection step
    else if (installationStep === "timeSlotSelection" && ["10:00 AM", "12:00 PM", "3:00 PM"].includes(option.value)) {
      handleTimeSlotSelection(option.value);
      return true;
    }
    
    // Feedback options
    else if (option.value === "yes-feedback") {
      setCurrentFeedbackQuestion(0);
      setFeedbackData((prev) => ({})); // Fixed: properly use the callback pattern
      handleFeedbackQuestion();
      return true;
    } 
    else if (option.value === "skip-feedback") {
      addBotMessage("Thank you for scheduling your POS installation. Is there anything else I can help you with?");
      
      // Reset installation flow and return to main menu
      setInstallationStep("merchantId");
      showMainMenu();
      return true;
    }
    
    // Feedback yes/no answers
    else if (installationStep === "feedback" && (option.value === "yes" || option.value === "no")) {
      const { feedbackQuestions } = require("@/constants/chatbot");
      const currentQuestion = feedbackQuestions[currentFeedbackQuestion];
      
      if (currentQuestion) {
        const key = currentQuestion.key;
        const isPositive = option.value === "yes";
        
        setFeedbackData(prev => ({
          ...prev,
          [key]: isPositive
        }));
        
        // Show coin earned for each positive answer
        if (isPositive) {
          addBotMessage(
            <div className="space-y-1">
              <p>You earned 1 Service Coin! 🪙</p>
              <p className="text-sm text-gray-600 italic">{currentQuestion.positiveDetail}</p>
            </div>
          , true);
        }
        
        // Move to next question
        setCurrentFeedbackQuestion(currentFeedbackQuestion + 1);
        setTimeout(() => {
          handleFeedbackQuestion();
        }, 500);
        return true;
      }
    }
    
    return false;
  };

  // Main handler for option selection
  const handleOptionSelect = (option: Option, addUserMessage: (content: string | React.ReactNode) => void) => {
    addUserMessage(option.label);
    
    // Handle main menu option selection
    if (option.value === "faq") {
      const { FAQ_MENU_OPTIONS } = require("@/constants/chatbot");
      // Show FAQ menu options logic
      addBotMessage("Here are some frequently asked questions:");
      return {
        options: FAQ_MENU_OPTIONS,
        showOptions: true,
        inputDisabled: true
      };
    } else if (option.value === "installation") {
      // Installation flow logic
      return { 
        showOptions: false,
        inputDisabled: false,
        startInstallation: true
      };
    } else if (["deinstallation", "reactivation", "maintenance"].includes(option.value)) {
      // Service request logic
      return {
        showOptions: false,
        inputDisabled: false,
        requestType: option.value,
        startServiceRequest: true
      };
    } else {
      // Delegate to specific handlers based on current step
      const handled = handleSpecificOptionSelection(option);
      
      if (!handled) {
        // Handle FAQ option selection as fallback
        const faqMatch = findFAQMatch(option.value);
        if (faqMatch) {
          addBotMessage(faqMatch.answer);
          setTimeout(() => {
            addBotMessage("Is there anything else you'd like to know?");
            showMainMenu();
          }, 1000);
          return { showOptions: false, inputDisabled: false };
        }
      }
      
      return { showOptions: false, inputDisabled: false };
    }
  };

  return {
    handleSpecificOptionSelection,
    handleOptionSelect
  };
};

export default useChatOptionHandlers;
