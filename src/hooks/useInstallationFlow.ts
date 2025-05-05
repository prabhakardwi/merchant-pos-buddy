
import { useState } from "react";
import { 
  ServiceRequest, 
  MerchantInfo, 
  InstallationStep,
  RequestType
} from "@/types/chatbot";

interface InstallationFlowProps {
  addUserMessage: (content: string | React.ReactNode) => void;
  addBotMessage: (content: string | React.ReactNode, showCoin?: boolean) => void;
  addSystemMessage: (content: string | React.ReactNode, showCoin?: boolean) => void;
  setCurrentOptions: (options: any[]) => void;
  setShowOptions: (show: boolean) => void;
  setInputDisabled: (disabled: boolean) => void;
  setExpectedInput: (input: string) => void;
  showMainMenu: () => void;
}

const useInstallationFlow = ({
  addUserMessage,
  addBotMessage,
  setInputDisabled,
  setExpectedInput,
  showMainMenu
}: InstallationFlowProps) => {
  const [activeRequestType, setActiveRequestType] = useState<RequestType | null>(null);
  const [installationStep, setInstallationStep] = useState<InstallationStep>("merchantId");
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
  const [currentRequest, setCurrentRequest] = useState<Partial<ServiceRequest>>({});
  const [otp, setOtp] = useState<string>("");
  
  // Fetch merchant info (simulated)
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
  
  // Initialize installation flow
  const handleInstallationInit = () => {
    setActiveRequestType("installation");
    setInstallationStep("merchantId");
    setExpectedInput("merchantId");
    setInputDisabled(false);
    
    addBotMessage("Let's get started with your installation request. Please enter your Merchant ID:");
  };
  
  // Handle installation flow steps
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
          }, 1000);
        } else {
          // Incorrect OTP
          setTimeout(() => {
            addBotMessage("Sorry, that OTP is incorrect. Please try again.");
            // Generate a new OTP for security
            const generateOTP = require("@/utils/chatbot").generateOTP;
            const newOtp = generateOTP();
            setOtp(newOtp);
            addBotMessage(`A new verification code has been sent: ${newOtp}`);
          }, 1000);
        }
        break;
      
      default:
        // For any other expected inputs, just pass them through
        addUserMessage(input);
        break;
    }
  };
  
  return {
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
    fetchMerchantInfo,
    handleInstallationFlow,
    handleInstallationInit
  };
};

export default useInstallationFlow;
