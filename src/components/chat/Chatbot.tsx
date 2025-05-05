
import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { Option, RequestType, POSType } from "@/types/chatbot";
import { GREETING_MESSAGE, MAIN_MENU_OPTIONS } from "@/constants/chatbot";
import { findFAQMatch } from "@/utils/chatbot";
import { toast } from "@/hooks/use-toast";
import useChatState from "@/hooks/useChatState";
import useInstallationFlow from "@/hooks/useInstallationFlow";
import useServiceRequests from "@/hooks/useServiceRequests";
import useFeedbackFlow from "@/hooks/useFeedbackFlow";
import useChatUIState from "@/hooks/useChatUIState";
import useChatOptionHandlers from "@/hooks/useChatOptionHandlers";

const Chatbot: React.FC = () => {
  // Core chat state management
  const { 
    messages, 
    addBotMessage, 
    addUserMessage, 
    addSystemMessage,
    showOptions,
    setShowOptions,
    currentOptions,
    setCurrentOptions,
    inputDisabled,
    setInputDisabled,
    expectedInput,
    setExpectedInput,
    showCoins,
    setMessages
  } = useChatState();
  
  // UI state management
  const {
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
    isInputDisabled
  } = useChatUIState();
  
  // Installation flow hooks
  const {
    activeRequestType,
    setActiveRequestType,
    installationStep,
    setInstallationStep,
    merchantInfo,
    setMerchantInfo,
    currentRequest,
    setCurrentRequest,
    otp,
    setOtp,
    handleInstallationFlow,
    handleInstallationInit
  } = useInstallationFlow({
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    setCurrentOptions,
    setShowOptions,
    setInputDisabled,
    setExpectedInput,
    showMainMenu
  });
  
  // Service request hooks
  const {
    handleServiceRequestInit,
    handleServiceRequestComplete,
    handleServiceRequestCancel
  } = useServiceRequests({
    addBotMessage,
    setActiveRequestType,
    setInputDisabled,
    showMainMenu
  });
  
  // Feedback flow hooks
  const {
    currentFeedbackQuestion,
    feedbackData,
    earnedCoins,
    handleFeedbackQuestion,
    handleTextFeedbackSubmit,
    handleCommentsSubmit,
    setCurrentFeedbackQuestion,
    setFeedbackData,
    setEarnedCoins
  } = useFeedbackFlow({
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    setCurrentOptions,
    setShowOptions,
    setInstallationStep,
    setInputDisabled,
    showMainMenu
  });
  
  // POS type selection handler
  const handlePOSTypeSelection = (posType: POSType) => {
    setCurrentRequest({
      ...currentRequest,
      posType
    });
    
    setTimeout(() => {
      if (posType === "APOS") {
        addBotMessage(
          <div className="space-y-2">
            <p>You've selected Advanced POS (APOS). Here are some features:</p>
            <ul className="list-disc pl-5">
              <li>Integrated contactless payments</li>
              <li>Advanced inventory management</li>
              <li>Customer loyalty program</li>
              <li>Cloud-based reporting and analytics</li>
              <li>Multi-location support</li>
            </ul>
          </div>
        );
      } else {
        addBotMessage(
          <div className="space-y-2">
            <p>You've selected Classic POS. Here are some features:</p>
            <ul className="list-disc pl-5">
              <li>Basic payment processing</li>
              <li>Simple inventory tracking</li>
              <li>Receipt printing</li>
              <li>Daily sales reports</li>
            </ul>
          </div>
        );
      }
      
      // Move to time slot selection
      setTimeout(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        
        addBotMessage(`Please select a time slot for your installation on ${tomorrowFormatted}:`);
        
        setInstallationStep("timeSlotSelection");
        setCurrentOptions([
          { id: "slot1", label: "10:00 AM", value: "10:00 AM" },
          { id: "slot2", label: "12:00 PM", value: "12:00 PM" },
          { id: "slot3", label: "3:00 PM", value: "3:00 PM" }
        ]);
        setShowOptions(true);
      }, 2000);
    }, 1000);
  };
  
  // Time slot selection handler
  const handleTimeSlotSelection = (selectedTime: string) => {
    const { generateTicketNumber, getServiceEngineer } = require("@/utils/chatbot");
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    // Generate service engineer and ticket
    const engineer = getServiceEngineer();
    const ticketNumber = generateTicketNumber();
    
    const finalRequest = {
      ...(currentRequest),
      preferredDate: tomorrowFormatted,
      preferredTime: selectedTime,
      requestType: "installation" as RequestType, // Type casting here
      serialNumber: `SN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      ticketNumber,
      serviceEngineerName: engineer.name,
      serviceEngineerMobile: engineer.mobile
    };
    
    setCurrentRequest(finalRequest);
    
    // Show confirmation message
    setTimeout(() => {
      addSystemMessage(
        <div className="space-y-2">
          <p className="font-medium">✅ Installation Request Submitted</p>
          <p>Your service ticket has been created:</p>
          <p className="bg-brand-lightBlue p-2 rounded text-center font-bold">
            Ticket #{ticketNumber}
          </p>
          <p>Service engineer <strong>{engineer.name}</strong> will visit your location on <strong>{tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedTime}</strong>.</p>
          <p>Contact engineer at: {engineer.mobile}</p>
        </div>
      );
      
      toast({
        title: "Installation Scheduled",
        description: `Your ticket #${ticketNumber} has been created.`,
        duration: 5000,
      });
      
      // Start feedback process after a delay
      setTimeout(() => {
        addBotMessage("We'd like to ask for your feedback on previous installations to earn service coins. Would you like to proceed with the feedback?");
        setCurrentOptions([
          { id: "yes-feedback", label: "Yes, provide feedback", value: "yes-feedback" },
          { id: "skip-feedback", label: "No, skip feedback", value: "skip-feedback" }
        ]);
        setShowOptions(true);
      }, 2000);
    }, 1000);
  };

  // Option selection handlers
  const { handleOptionSelect } = useChatOptionHandlers({
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
    showMainMenu
  });

  // Show main menu options
  function showMainMenu() {
    addSystemMessage("Please select an option:");
    setCurrentOptions(MAIN_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
    setExpectedInput("");
  }

  // Main input handler
  const handleUserInput = (input: string) => {
    // Handle specific expected inputs
    if (expectedInput === "merchantId" || expectedInput === "otpVerification") {
      handleInstallationFlow(input);
      return;
    }

    // Handle comments submission
    if (installationStep === "comments") {
      setComments(input);
      handleCommentsSubmit();
      return;
    }
    
    // Handle text feedback submission
    if (installationStep === "textFeedback") {
      setTextFeedback(input);
      handleTextFeedbackSubmit();
      return;
    }
    
    // General input handling for FAQs and unknown inputs
    addUserMessage(input);
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

  // Handle option selection with state updates
  const handleOptionSelectWrapper = (option: Option) => {
    const result = handleOptionSelect(option, addUserMessage);
    
    // Update states based on the result
    if (result.showOptions !== undefined) setShowOptions(result.showOptions);
    if (result.inputDisabled !== undefined) setInputDisabled(result.inputDisabled);
    
    // Start specific flows if needed
    if (result.startInstallation) {
      handleInstallationInit();
    } else if (result.startServiceRequest && result.requestType) {
      handleServiceRequestInit(result.requestType as RequestType);
    }
    
    // Update options if provided
    if (result.options) {
      setCurrentOptions(result.options);
      setShowOptions(true);
    }
  };

  // Restart chatbot
  const handleRestart = () => {
    // Reset all state
    setMessages([]);
    setShowOptions(false);
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    setExpectedInput("");
    setInstallationStep("merchantId");
    setCurrentRequest({});
    setMerchantInfo(null);
    setCurrentFeedbackQuestion(0);
    setFeedbackData({});
    setShowTextFeedback(false);
    setTextFeedback("");
    setShowComments(false);
    setComments("");
    setEarnedCoins(0);
    
    // Re-initialize chatbot
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  };

  // Skip handlers for feedback forms
  const handleSkipTextFeedback = () => {
    setShowTextFeedback(false);
    addBotMessage("Is there anything else I can help you with?");
    showMainMenu();
  };

  const handleSkipComments = () => {
    setShowComments(false);
    setInputDisabled(false);
    addBotMessage("Is there anything else I can help you with?");
    showMainMenu();
  };

  // Calculate input placeholder
  const placeholder = getInputPlaceholder(
    expectedInput,
    inputDisabled,
    showTextFeedback,
    showComments
  );

  // Calculate if input should be disabled
  const inputIsDisabled = isInputDisabled(
    inputDisabled,
    showForm,
    showTextFeedback,
    textFeedback,
    showComments,
    comments
  );

  // Initialize chatbot with greeting
  useEffect(() => {
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader earnedCoins={earnedCoins} onRestart={handleRestart} />
      
      <ChatBody
        messages={messages}
        showCoins={showCoins}
        showOptions={showOptions}
        currentOptions={currentOptions}
        handleOptionSelect={handleOptionSelectWrapper}
        showForm={showForm}
        activeRequestType={activeRequestType}
        handleServiceRequestComplete={handleServiceRequestComplete}
        handleServiceRequestCancel={handleServiceRequestCancel}
        showTextFeedback={showTextFeedback}
        textFeedback={textFeedback}
        setTextFeedback={setTextFeedback}
        handleTextFeedbackSubmit={handleTextFeedbackSubmit}
        showComments={showComments}
        comments={comments}
        setComments={setComments}
        handleCommentsSubmit={handleCommentsSubmit}
        inputDisabled={inputDisabled}
      />
      
      <ChatFooter
        onSubmit={handleUserInput}
        disabled={inputIsDisabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Chatbot;
