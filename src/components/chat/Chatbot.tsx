
import React, { useRef, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Option, RequestType, ServiceRequest } from "@/types/chatbot";
import { GREETING_MESSAGE, MAIN_MENU_OPTIONS, FAQ_MENU_OPTIONS, REQUEST_TYPE_LABELS } from "@/constants/chatbot";
import { findFAQMatch } from "@/utils/chatbot";
import { generateOTP } from "@/utils/merchantUtils";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import OptionButtons from "./OptionButtons";
import ServiceRequestForm from "./ServiceRequestForm";
import ChatHeader from "./ChatHeader";
import TextFeedbackForm from "./TextFeedbackForm";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useInstallationFlow } from "@/hooks/useInstallationFlow";

const Chatbot: React.FC = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [activeRequestType, setActiveRequestType] = useState<RequestType | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [expectedInput, setExpectedInput] = useState<string>("");
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    showCoins, 
    addBotMessage, 
    addUserMessage, 
    addSystemMessage, 
    clearMessages 
  } = useChatMessages();
  
  // Create a showMainMenu reference function that we can pass to the hook
  const showMainMenuRef = React.useCallback(() => {
    addSystemMessage("Please select an option:");
    setCurrentOptions(MAIN_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
    setExpectedInput("");
  }, [addSystemMessage]);
  
  const {
    installationStep,
    setInstallationStep,
    otp,
    setOtp,
    earnedCoins,
    setEarnedCoins,
    showTextFeedback,
    textFeedback,
    setTextFeedback,
    feedbackData,
    setFeedbackData,
    currentFeedbackQuestion,
    setCurrentFeedbackQuestion,
    handleMerchantIdInput,
    handleOtpVerification,
    handlePosTypeSelection,
    handleTimeSlotSelection,
    handleFeedbackQuestion,
    handleFeedbackResponse,
    handleTextFeedbackSubmit,
    skipTextFeedback,
    resetInstallationFlow
  } = useInstallationFlow(addBotMessage, addUserMessage, addSystemMessage, showMainMenuRef);

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

  function showMainMenu() {
    showMainMenuRef();
  }

  function showFAQMenu() {
    addSystemMessage("Here are some frequently asked questions:");
    setCurrentOptions(FAQ_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
  }

  const handleInstallationFlow = (input: string) => {
    switch (installationStep) {
      case "merchantId":
        handleMerchantIdInput(input);
        break;
        
      case "otpVerification":
        handleOtpVerification(input);
        break;
        
      default:
        // Handle any other input
        handleUserInput(input);
        break;
    }
  };

  const handleOptionSelect = (option: Option) => {
    addUserMessage(option.label);
    setShowOptions(false);
    setInputDisabled(false);
    
    // Handle main menu option selection
    if (option.value === "faq") {
      showFAQMenu();
    } else if (option.value === "installation") {
      handleInstallationInit();
    } else if (["deinstallation", "reactivation", "maintenance"].includes(option.value)) {
      handleServiceRequestInit(option.value as RequestType);
    } else if (option.value === "yes" && installationStep === "confirmMerchant") {
      // Handle confirmation of merchant info
      const newOtp = generateOTP();
      setOtp(newOtp);
      setTimeout(() => {
        addBotMessage(`Great! To verify your identity, we've sent a one-time password (OTP) to the registered mobile number. For this demo, your OTP is: ${newOtp}`);
        addBotMessage("Please enter the OTP to proceed:");
        setInstallationStep("otpVerification");
        setExpectedInput("otpVerification");
      }, 1000);
    } else if (option.value === "no" && installationStep === "confirmMerchant") {
      // Go back to merchant ID input
      setTimeout(() => {
        addBotMessage("Let's try again. Please enter your Merchant ID:");
        setInstallationStep("merchantId");
        setExpectedInput("merchantId");
      }, 1000);
    } else if ((option.value === "APOS" || option.value === "ClassicPOS") && installationStep === "posTypeSelection") {
      handlePosTypeSelection(option.value);
    } else if (installationStep === "timeSlotSelection" && ["10:00 AM", "12:00 PM", "3:00 PM"].includes(option.value)) {
      handleTimeSlotSelection(option.value);
    } else if (option.value === "yes-feedback") {
      // Start the feedback process
      setCurrentFeedbackQuestion(0);
      setFeedbackData({});
      setEarnedCoins(0);
      handleFeedbackQuestion();
    } else if (option.value === "skip-feedback") {
      // Skip feedback and return to main menu
      addBotMessage("Thank you for scheduling your POS installation. Is there anything else I can help you with?");
      
      // Reset installation flow and return to main menu
      resetInstallationFlow();
      setExpectedInput("");
      showMainMenu();
    } else if (installationStep === "feedback" && (option.value === "yes" || option.value === "no")) {
      handleFeedbackResponse(option.value === "yes");
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

  const handleInstallationInit = () => {
    setActiveRequestType("installation");
    setInstallationStep("merchantId");
    setExpectedInput("merchantId");
    setInputDisabled(false);
    setShowOptions(false);
    
    addBotMessage("Let's get started with your installation request. Please enter your Merchant ID:");
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
    if (expectedInput === "merchantId" || expectedInput === "otpVerification") {
      handleInstallationFlow(input);
      return;
    }
    
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
    clearMessages();
    setShowOptions(false);
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    setExpectedInput("");
    resetInstallationFlow();
    setEarnedCoins(0);
    
    // Re-initialize chatbot
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader earnedCoins={earnedCoins} onRestart={handleRestart} />
      
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
        
        {showTextFeedback && (
          <TextFeedbackForm
            value={textFeedback}
            onChange={setTextFeedback}
            onSubmit={handleTextFeedbackSubmit}
            onSkip={skipTextFeedback}
          />
        )}
        
        {showForm && activeRequestType && activeRequestType !== "installation" && (
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
          disabled={inputDisabled || showForm || showTextFeedback}
          placeholder={
            expectedInput === "merchantId" ? "Enter your Merchant ID..." :
            expectedInput === "otpVerification" ? "Enter the OTP code..." :
            showTextFeedback ? "Type your feedback..." :
            inputDisabled ? "Please select an option above..." : 
            "Type your question here..."
          }
        />
      </div>
    </div>
  );
};

export default Chatbot;
