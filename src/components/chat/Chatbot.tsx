
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
  Language
} from "@/types/chatbot";
import { 
  GREETING_MESSAGE, 
  MAIN_MENU_OPTIONS, 
  FAQ_MENU_OPTIONS,
  REQUEST_TYPE_LABELS,
  TIME_SLOTS
} from "@/constants/chatbot";
import { 
  findFAQMatch, 
  formatBotMessage, 
  generateTicketNumber, 
  getCurrentDate,
  getTranslatedText
} from "@/utils/chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquare, RotateCcw, Coins, Languages, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [showCoins, setShowCoins] = useState<boolean[]>([]);
  const [language, setLanguage] = useState<Language>("english");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Language options for the dropdown - including Marathi
  const languageOptions: { value: Language; label: string }[] = [
    { value: "english", label: "English" },
    { value: "hindi", label: "हिंदी (Hindi)" },
    { value: "marathi", label: "मराठी (Marathi)" },
    { value: "spanish", label: "Español (Spanish)" }
  ];

  // Get translated text helper
  const translate = (key: string, params: Record<string, string> = {}) => {
    return getTranslatedText(key, language, params);
  };

  // Initialize chatbot with greeting
  useEffect(() => {
    addBotMessage(translate("greeting"));
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  }, []);

  // Re-initialize bot when language changes
  useEffect(() => {
    if (messages.length > 0) {
      handleRestart();
    }
  }, [language]);

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
    addSystemMessage(translate("select_option"));
    
    // Update main menu options with translations
    const translatedMainMenu: Option[] = [
      { id: "installation", label: translate("installation"), value: "installation" },
      { id: "deinstallation", label: translate("deinstallation"), value: "deinstallation" },
      { id: "reactivation", label: translate("reactivation"), value: "reactivation" },
      { id: "maintenance", label: translate("maintenance"), value: "maintenance" },
      { id: "faq", label: translate("faq"), value: "faq" }
    ];
    
    setCurrentOptions(translatedMainMenu);
    setShowOptions(true);
    setInputDisabled(true);
    setExpectedInput("");
  };

  // Function to go back to main menu from anywhere
  const handleBackToMenu = () => {
    // Add a message to indicate going back to main menu
    addSystemMessage(translate("back_to_menu"));
    
    // Reset all states
    setShowOptions(false);
    setShowForm(false);
    setInputDisabled(false);
    setExpectedInput("");
    
    // Show main menu options
    showMainMenu();
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
                <p>{translate("merchant_info_found")}</p>
                <p><strong>{translate("business")}</strong> {merchant.businessName}</p>
                <p><strong>{translate("address")}</strong> {merchant.address}</p>
                <p><strong>{translate("contact")}</strong> {merchant.contactName}</p>
                <p><strong>{translate("mobile")}</strong> {merchant.contactMobile}</p>
                <p className="mt-4">{translate("merchant_confirmation")}</p>
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
            addBotMessage(translate("otp_success"));
            setInstallationStep("posTypeSelection");
            setCurrentOptions([
              { id: "apos", label: translate("apos"), value: "APOS" },
              { id: "classic", label: translate("classic_pos"), value: "ClassicPOS" }
            ]);
            setShowOptions(true);
          }, 1000);
        } else {
          // Incorrect OTP
          setTimeout(() => {
            addBotMessage(translate("otp_error"));
            // Generate a new OTP for security
            const newOtp = generateOTP();
            setOtp(newOtp);
            addBotMessage(`${translate("otp_sent")} ${newOtp}`);
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
        addBotMessage(translate("merchant_id_prompt"));
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
          
          addBotMessage(`${translate("time_slot")} ${tomorrowFormatted}:`);
          
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
            <p className="font-medium">✅ {translate("request_submitted")}</p>
            <p>{translate("ticket_created")}</p>
            <p className="bg-brand-lightBlue p-2 rounded text-center font-bold">
              Ticket #{ticketNumber}
            </p>
            <p>{translate("engineer_visit")} <strong>{tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedTime}</strong>.</p>
            <p>{translate("contact_engineer")} {engineer.mobile}</p>
          </div>
        );
        
        toast({
          title: "Installation Scheduled",
          description: `Your ticket #${ticketNumber} has been created.`,
          duration: 5000,
        });
        
        // Return to main menu after installation is scheduled
        setTimeout(() => {
          addBotMessage(translate("anything_else"));
          showMainMenu();
        }, 2000);
      }, 1000);
    } else {
      // Handle FAQ option selection
      const faqMatch = findFAQMatch(option.value);
      if (faqMatch) {
        addBotMessage(faqMatch.answer);
        setTimeout(() => {
          addBotMessage(translate("anything_else"));
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
    
    addBotMessage(translate("merchant_id_prompt"));
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
      addBotMessage(translate("anything_else"));
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
          addBotMessage(translate("anything_else"));
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
    setEarnedCoins(0);
    setShowCoins([]);
    
    // Re-initialize chatbot
    addBotMessage(translate("greeting"));
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  };
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-brand-blue text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-medium">HDFC- Merchant POS Support</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <Languages className="h-4 w-4 text-white" />
            <Select 
              defaultValue={language} 
              onValueChange={(value) => handleLanguageChange(value as Language)}
            >
              <SelectTrigger className="h-8 w-32 border-none bg-brand-blue/80 text-white text-sm focus:ring-0">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
        
        {showForm && activeRequestType && activeRequestType !== "installation" && (
          <ServiceRequestForm 
            requestType={activeRequestType}
            onComplete={handleServiceRequestComplete}
            onCancel={handleServiceRequestCancel}
          />
        )}
      </div>
      
      <div className="p-4 border-t bg-white rounded-b-lg">
        {/* Back to Menu button */}
        <div className="flex items-center mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToMenu}
            className="flex items-center gap-1 text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4" />
            {translate("back_to_menu") || "Back to Menu"}
          </Button>
        </div>
        
        <ChatInput 
          onSubmit={handleUserInput} 
          disabled={inputDisabled || showForm}
          placeholder={
            expectedInput === "merchantId" ? "Enter your Merchant ID..." :
            expectedInput === "otpVerification" ? "Enter the OTP code..." :
            inputDisabled ? "Please select an option above..." : 
            "Type your question here..."
          }
        />
      </div>
    </div>
  );
};

export default Chatbot;
