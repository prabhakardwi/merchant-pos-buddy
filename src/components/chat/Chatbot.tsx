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
  InstallationStep,
  POSType,
  FeedbackData
} from "@/types/chatbot";
import { 
  GREETING_MESSAGE, 
  MAIN_MENU_OPTIONS, 
  FAQ_MENU_OPTIONS,
  REQUEST_TYPE_LABELS,
  TIME_SLOTS,
  FEEDBACK_QUESTIONS,
  COMMENTS_PROMPT
} from "@/constants/chatbot";
import { findFAQMatch, formatBotMessage, generateTicketNumber, getCurrentDate } from "@/utils/chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquare, RotateCcw, Coins } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [activeRequestType, setActiveRequestType] = useState<RequestType | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [expectedInput, setExpectedInput] = useState<string>("");
  const [installationStep, setInstallationStep] = useState<InstallationStep>("merchantId");
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
  const [currentRequest, setCurrentRequest] = useState<Partial<ServiceRequest>>({});
  const [otp, setOtp] = useState<string>("");
  const [currentFeedbackQuestion, setCurrentFeedbackQuestion] = useState<number>(0);
  const [feedbackData, setFeedbackData] = useState<Partial<FeedbackData>>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Add new state variables for comments section
  const [showTextFeedback, setShowTextFeedback] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false); 
  const [comments, setComments] = useState<string>("");
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [showCoins, setShowCoins] = useState<boolean[]>([]);

  // Feedback questions array - updated to match our reduced list in constants
  const feedbackQuestions = [
    { key: "scheduledDateMet", question: "Was the installation done on the scheduled date?" },
    { key: "engineerProfessional", question: "Was the engineer polite and professional?" },
    { key: "properInstallation", question: "Was the device installed properly?" },
    { key: "trainingProvided", question: "Was the demo/training provided?" },
    { key: "merchantIdShared", question: "Were TIDs and merchant IDs shared?" }
  ];

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

  const addMessage = (message: Omit<Message, "id" | "timestamp">, showCoin: boolean = false) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (showCoin) {
      setShowCoins(prev => [...prev, true]);
    } else {
      setShowCoins(prev => [...prev, false]);
    }
  };

  const addBotMessage = (content: string | React.ReactNode, showCoin: boolean = false) => {
    addMessage({ type: "bot", content }, showCoin);
  };

  const addUserMessage = (content: string | React.ReactNode) => {
    addMessage({ type: "user", content });
  };

  const addSystemMessage = (content: string | React.ReactNode, showCoin: boolean = false) => {
    addMessage({ type: "system", content }, showCoin);
  };

  const showMainMenu = () => {
    addSystemMessage("Please select an option:");
    setCurrentOptions(MAIN_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
    setExpectedInput("");
  };

  const showFAQMenu = () => {
    addSystemMessage("Here are some frequently asked questions:");
    setCurrentOptions(FAQ_MENU_OPTIONS);
    setShowOptions(true);
    setInputDisabled(true);
  };

  const fetchMerchantInfo = (merchantId: string): MerchantInfo => {
    // In a real app, this would fetch from an API
    return {
      id: merchantId,
      businessName: `Merchant ${merchantId.substring(0, 4)} Store`,
      address: `${Math.floor(Math.random() * 999) + 1} Main Street, Suite ${Math.floor(Math.random() * 100) + 1}, City`,
      contactName: `John ${merchantId.substring(0, 1).toUpperCase()}${merchantId.substring(1, 4)}`,
      contactMobile: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    };
  };

  // Generate a random 4-digit OTP
  const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Generate a random service engineer
  const getServiceEngineer = (): { name: string; mobile: string } => {
    const names = ["Alex Smith", "Jamie Johnson", "Chris Wilson", "Taylor Brown", "Jordan Lee"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const mobile = `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    return { name: randomName, mobile };
  };

  const handleTextFeedbackSubmit = () => {
    if (textFeedback.trim()) {
      addUserMessage(textFeedback);
      
      // Update feedback data with text feedback
      setFeedbackData(prev => ({
        ...prev,
        textFeedback: textFeedback
      }));
      
      // Add 5 more coins for text feedback
      const additionalCoins = 5;
      const newCoins = earnedCoins + additionalCoins;
      setEarnedCoins(newCoins);
      
      // Hide text feedback form
      setShowTextFeedback(false);
      
      // Show confirmation for text feedback
      setTimeout(() => {
        addSystemMessage(
          <div className="space-y-2">
            <p className="font-medium">✅ Feedback Submitted - Thank You!</p>
            <p>Thank you for your detailed feedback! You've earned <strong>{additionalCoins} Service Coins</strong>!</p>
          </div>
        , true);
        
        // Now prompt for additional comments - Fixed by moving this OUTSIDE the timeout
      }, 1000);
      
      setTimeout(() => {
        addBotMessage(
          <div className="space-y-2">
            <p>{COMMENTS_PROMPT}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-yellow-500" />
                <p className="font-medium text-yellow-700">Share your comments to earn 3 extra Service Coins!</p>
              </div>
            </div>
          </div>
        );
        setInstallationStep("comments");
        setShowComments(true);
        setInputDisabled(false);
      }, 1500);
    }
  };

  const handleCommentsSubmit = () => {
    if (comments.trim()) {
      addUserMessage(comments);
      
      // Update current request with comments
      setCurrentRequest(prev => ({
        ...prev,
        comments: comments
      }));
      
      // Add 3 more coins for providing comments
      const additionalCoins = 3;
      const newTotalCoins = earnedCoins + additionalCoins;
      setEarnedCoins(newTotalCoins);
      
      // Hide comments form
      setShowComments(false);
      
      // Show confirmation and total coins earned
      setTimeout(() => {
        addSystemMessage(
          <div className="space-y-2">
            <p className="font-medium">✅ Comments Received - Thank You!</p>
            <p>Thank you for your valuable comments! You've earned <strong>{additionalCoins} extra Service Coins</strong>!</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
              <div className="flex items-center gap-2 text-yellow-700">
                <Coins className="h-5 w-5 text-yellow-500" />
                <p className="font-semibold">Total Service Coins Earned: {newTotalCoins}</p>
              </div>
              <p className="text-sm mt-1 text-yellow-600">Collect 100 coins to redeem for 3 free paper rolls!</p>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="font-medium text-blue-700 mb-2">Your comments:</p>
              <p className="text-blue-800 italic">"{comments}"</p>
            </div>
          </div>
        , true);
        
        toast({
          title: "Coins Earned!",
          description: `You've earned ${additionalCoins} Service Coins. Your total is now ${newTotalCoins}.`,
          duration: 5000,
        });
        
        // Return to main menu
        setTimeout(() => {
          addBotMessage("Is there anything else I can help you with?");
          showMainMenu();
        }, 2000);
      }, 1000);
    }
  };

  const handleFeedbackQuestion = () => {
    if (currentFeedbackQuestion < FEEDBACK_QUESTIONS.length) {
      const question = FEEDBACK_QUESTIONS[currentFeedbackQuestion];
      
      addBotMessage(
        <div className="space-y-1">
          <p>{question.question}</p>
        </div>
      );
      
      setCurrentOptions([
        { id: "yes", label: "Yes", value: "yes" },
        { id: "no", label: "No", value: "no" }
      ]);
      setShowOptions(true);
      setInstallationStep("feedback");
    } else {
      // All feedback questions completed
      const positiveAnswers = Object.values(feedbackData).filter(value => value === true).length;
      const feedbackScore = Math.round((positiveAnswers / FEEDBACK_QUESTIONS.length) * 100);
      
      // Award service coins based on feedback
      const feedbackCoins = positiveAnswers;
      setEarnedCoins(feedbackCoins);
      
      addSystemMessage(
        <div className="space-y-2">
          <p className="font-medium">✅ Feedback Submitted</p>
          <p>Thank you for your feedback! You've earned <strong>{feedbackCoins} Service Coins</strong> for completing the survey.</p>
          <p>Your feedback score: <strong>{feedbackScore}%</strong></p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
            <div className="flex items-center gap-2 text-yellow-700">
              <Coins className="h-5 w-5 text-yellow-500" />
              <p className="font-semibold">Service Coins Earned: {feedbackCoins}</p>
            </div>
          </div>
        </div>
      , true);
      
      toast({
        title: "Feedback Submitted",
        description: `You've earned ${feedbackCoins} Service Coins!`,
        duration: 5000,
      });
      
      // Ask for additional text feedback
      setTimeout(() => {
        addBotMessage(
          <div className="space-y-2">
            <p>We'd love to hear more about your experience in detail.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-yellow-500" />
                <p className="font-medium text-yellow-700">Share your comments to earn 5 extra Service Coins!</p>
              </div>
            </div>
            <p>Please provide any additional feedback or suggestions:</p>
          </div>
        );
        setInstallationStep("textFeedback");
        setShowTextFeedback(true);
        // Ensure input field is enabled for text feedback
        setInputDisabled(false);
      }, 2000);
    }
  };

  const handleInstallationFlow = (input: string) => {
    switch (installationStep) {
      case "merchantId":
        if (input.trim() !== "") {
          addUserMessage(input);
          const merchant = fetchMerchantInfo(input);
          setMerchantInfo(merchant);
          setCurrentRequest({
            ...currentRequest,
            merchantId: input,
            merchantName: merchant.businessName,
            contactName: merchant.contactName,
            contactMobile: merchant.contactMobile
          });
          
          // Show merchant information and ask for confirmation
          setTimeout(() => {
            addBotMessage(
              <div className="space-y-2">
                <p>I found your merchant information:</p>
                <p><strong>Business:</strong> {merchant.businessName}</p>
                <p><strong>Address:</strong> {merchant.address}</p>
                <p><strong>Contact:</strong> {merchant.contactName}</p>
                <p><strong>Mobile:</strong> {merchant.contactMobile}</p>
                <p className="mt-4">Is this information correct? We'll need to verify with an OTP.</p>
              </div>
            );
            setInstallationStep("confirmMerchant");
            
            // Provide yes/no options
            setCurrentOptions([
              { id: "yes", label: "Yes, this is correct", value: "yes" },
              { id: "no", label: "No, try again", value: "no" }
            ]);
            setShowOptions(true);
          }, 1000);
        }
        break;
        
      case "otpVerification":
        addUserMessage(input);
        
        // Check if OTP matches
        if (input === otp) {
          // OTP is correct, move to POS type selection
          setTimeout(() => {
            addBotMessage("OTP verification successful! Now, which type of POS would you like to install?");
            setInstallationStep("posTypeSelection");
            setCurrentOptions([
              { id: "apos", label: "Advanced POS (APOS)", value: "APOS" },
              { id: "classic", label: "Classic POS", value: "ClassicPOS" }
            ]);
            setShowOptions(true);
          }, 1000);
        } else {
          // Incorrect OTP
          setTimeout(() => {
            addBotMessage("Sorry, that OTP is incorrect. Please try again.");
            // Generate a new OTP for security
            const newOtp = generateOTP();
            setOtp(newOtp);
            addBotMessage(`A new verification code has been sent: ${newOtp}`);
          }, 1000);
        }
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
      // Handle POS type selection
      const posType = option.value as POSType;
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
    } else if (installationStep === "timeSlotSelection" && ["10:00 AM", "12:00 PM", "3:00 PM"].includes(option.value)) {
      // Handle time slot selection
      const selectedTime = option.value;
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
      setInstallationStep("merchantId");
      setCurrentRequest({});
      setMerchantInfo(null);
      setExpectedInput("");
      showMainMenu();
    } else if (installationStep === "feedback" && (option.value === "yes" || option.value === "no")) {
      // Handle feedback response
      const currentQuestion = FEEDBACK_QUESTIONS[currentFeedbackQuestion];
      
      // Fix: Check if currentQuestion exists before attempting to access its key property
      if (currentQuestion) {
        const key = currentQuestion.key as keyof FeedbackData;
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
      }
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
    setEarnedCoins(0);
    setShowCoins([]);
    
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
        
        {showTextFeedback && (
          <div className="bg-white border rounded-lg p-4 mt-4 shadow-sm animate-fade-in">
            <h3 className="font-medium mb-2 text-brand-dark">Additional Feedback</h3>
            <div className="flex items-center gap-2 mb-3 bg-yellow-50 p-2 rounded-md">
              <Coins className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Earn 5 extra Service Coins!</span> Share your detailed experience.
              </p>
            </div>
            <Textarea 
              value={textFeedback}
              onChange={(e) => setTextFeedback(e.target.value)}
              placeholder="Please share your experience and suggestions..."
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowTextFeedback(false);
                  addBotMessage("Is there anything else I can help you with?");
                  showMainMenu();
                }}
              >
                Skip
              </Button>
              <Button 
                size="sm"
                onClick={handleTextFeedbackSubmit}
                disabled={!textFeedback.trim()}
              >
                <div className="flex items-center gap-1">
                  <span>Submit</span>
                  <Coins className="h-4 w-4" />
                  <span>+5</span>
                </div>
              </Button>
            </div>
          </div>
        )}
        
        {/* Make sure Comments section is visibly displayed when showComments is true */}
        {showComments && (
          <div className="bg-white border rounded-lg p-4 mt-4 shadow-sm animate-fade-in">
            <h3 className="font-medium mb-2 text-brand-dark">Merchant Comments</h3>
            <div className="flex items-center gap-2 mb-3 bg-yellow-50 p-2 rounded-md">
              <Coins className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Earn 3 extra Service Coins!</span> Share your comments about our service.
              </p>
            </div>
            <Textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please share your comments on our POS system and service..."
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowComments(false);
                  addBotMessage("Is there anything else I can help you with?");
                  showMainMenu();
                }}
              >
                Skip
              </Button>
              <Button 
                size="sm"
                onClick={handleCommentsSubmit}
                disabled={!comments.trim()}
              >
                <div className="flex items-center gap-1">
                  <span>Submit</span>
                  <Coins className="h-4 w-4" />
                  <span>+3</span>
                </div>
              </Button>
            </div>
          </div>
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
