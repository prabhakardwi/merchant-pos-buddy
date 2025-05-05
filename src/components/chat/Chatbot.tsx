
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import OptionButtons from "./OptionButtons";
import ServiceRequestForm from "./ServiceRequestForm";
import { 
  Message, 
  Option, 
  ServiceRequest, 
  RequestType, 
  MerchantInfo,
  InstallationStep
} from "@/types/chatbot";
import { 
  GREETING_MESSAGE, 
  MAIN_MENU_OPTIONS
} from "@/constants/chatbot";
import { findFAQMatch } from "@/utils/chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquare, RotateCcw, Coins } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useChatState from "@/hooks/useChatState";
import useInstallationFlow from "@/hooks/useInstallationFlow";
import useServiceRequests from "@/hooks/useServiceRequests";
import useFeedbackFlow from "@/hooks/useFeedbackFlow";

const Chatbot: React.FC = () => {
  // Chat UI State
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
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
    setShowCoins
  } = useChatState();
  
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
    showForm,
    setShowForm,
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
    showTextFeedback,
    textFeedback,
    showComments,
    comments,
    handleFeedbackQuestion,
    handleTextFeedbackSubmit,
    handleCommentsSubmit,
    setShowTextFeedback,
    setTextFeedback,
    setShowComments,
    setComments,
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
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showTextFeedback, showComments]);

  // Initialize chatbot with greeting
  useEffect(() => {
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  }, []);
  
  // Show main menu options
  function showMainMenu() {
    addSystemMessage("Please select an option:");
    setCurrentOptions(MAIN_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
    setExpectedInput("");
  }

  // Show FAQ menu options
  function showFAQMenu() {
    addSystemMessage("Here are some frequently asked questions:");
    const { FAQ_MENU_OPTIONS } = require("@/constants/chatbot");
    setCurrentOptions(FAQ_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
  }
  
  // Main handler for option selection
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
        }
      }
    }
  };
  
  // Handler for specific option selection based on current step
  const handleSpecificOptionSelection = (option: Option): boolean => {
    // Merchant confirmation step
    if (installationStep === "confirmMerchant") {
      if (option.value === "yes") {
        const newOtp = require("@/utils/chatbot").generateOTP();
        setOtp(newOtp);
        setTimeout(() => {
          addBotMessage(`Great! To verify your identity, we've sent a one-time password (OTP) to the registered mobile number. For this demo, your OTP is: ${newOtp}`);
          addBotMessage("Please enter the OTP to proceed:");
          setInstallationStep("otpVerification");
          setExpectedInput("otpVerification");
        }, 1000);
        return true;
      } else if (option.value === "no") {
        setTimeout(() => {
          addBotMessage("Let's try again. Please enter your Merchant ID:");
          setInstallationStep("merchantId");
          setExpectedInput("merchantId");
        }, 1000);
        return true;
      }
    }
    
    // POS type selection step
    else if (installationStep === "posTypeSelection" && (option.value === "APOS" || option.value === "ClassicPOS")) {
      handlePOSTypeSelection(option.value);
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
      setFeedbackData({});
      setEarnedCoins(0);
      handleFeedbackQuestion();
      return true;
    } 
    else if (option.value === "skip-feedback") {
      addBotMessage("Thank you for scheduling your POS installation. Is there anything else I can help you with?");
      
      // Reset installation flow and return to main menu
      setInstallationStep("merchantId");
      setCurrentRequest({});
      setMerchantInfo(null);
      setExpectedInput("");
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
  
  // Handle POS type selection
  const handlePOSTypeSelection = (posType: string) => {
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
  
  // Handle time slot selection
  const handleTimeSlotSelection = (selectedTime: string) => {
    const { generateTicketNumber, getServiceEngineer } = require("@/utils/chatbot");
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    // Generate service engineer and ticket
    const engineer = getServiceEngineer();
    const ticketNumber = generateTicketNumber();
    
    const finalRequest: ServiceRequest = {
      ...(currentRequest as ServiceRequest),
      preferredDate: tomorrowFormatted,
      preferredTime: selectedTime,
      requestType: "installation",
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
    setShowCoins([]);
    
    // Re-initialize chatbot
    addBotMessage(GREETING_MESSAGE);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  };

  // Rendering of the main Chatbot UI
  return (
    <div className="flex flex-col h-full">
      <div className="bg-brand-blue text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-medium">HDFC- Merchant POS Support</h2>
        </div>
        <div className="flex items-center gap-2">
          {earnedCoins > 0 && (
            <div className="flex items-center gap-1 bg-yellow-400 text-brand-dark px-2 py-1 rounded-full text-sm">
              <Coins className="h-4 w-4" />
              <span>{earnedCoins}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRestart}
            className="text-white hover:bg-brand-blue/80"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
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
              setShowTextFeedback(false);
              addBotMessage("Is there anything else I can help you with?");
              showMainMenu();
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
              setShowComments(false);
              setInputDisabled(false);
              addBotMessage("Is there anything else I can help you with?");
              showMainMenu();
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
      
      {/* Chat input area */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <ChatInput 
          onSubmit={handleUserInput} 
          disabled={inputDisabled || showForm || (showTextFeedback && !textFeedback.trim()) || (showComments && !comments.trim())}
          placeholder={
            expectedInput === "merchantId" ? "Enter your Merchant ID..." :
            expectedInput === "otpVerification" ? "Enter the OTP code..." :
            showTextFeedback ? "Type your feedback..." :
            showComments ? "Type your comments..." :
            inputDisabled ? "Please select an option above..." : 
            "Type your question here..."
          }
        />
      </div>
    </div>
  );
};

export default Chatbot;
