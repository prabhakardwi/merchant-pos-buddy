
import { useState } from 'react';
import { generateTicketNumber } from "@/utils/chatbot";
import { fetchMerchantInfo, generateOTP, getServiceEngineer } from "@/utils/merchantUtils";
import { ServiceRequest, MerchantInfo, RequestType, POSType, InstallationStep, FeedbackData } from '@/types/chatbot';
import { toast } from "@/hooks/use-toast";
import { feedbackQuestions, calculateFeedbackScore } from "@/utils/feedbackUtils";
import { Coins } from "lucide-react";

export const useInstallationFlow = (
  addBotMessage: (message: string | React.ReactNode, showCoin?: boolean) => void,
  addUserMessage: (message: string | React.ReactNode) => void,
  addSystemMessage: (message: string | React.ReactNode, showCoin?: boolean) => void,
  showMainMenu: () => void
) => {
  const [installationStep, setInstallationStep] = useState<InstallationStep>("merchantId");
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
  const [currentRequest, setCurrentRequest] = useState<Partial<ServiceRequest>>({});
  const [otp, setOtp] = useState<string>("");
  const [currentFeedbackQuestion, setCurrentFeedbackQuestion] = useState<number>(0);
  const [feedbackData, setFeedbackData] = useState<Partial<FeedbackData>>({});
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [showTextFeedback, setShowTextFeedback] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string>("");

  const handleMerchantIdInput = (input: string) => {
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
  };

  const handleOtpVerification = (input: string) => {
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
        const newOtp = generateOTP();
        setOtp(newOtp);
        addBotMessage(`A new verification code has been sent: ${newOtp}`);
      }, 1000);
    }
  };

  const handlePosTypeSelection = (posType: POSType) => {
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
      }, 2000);
    }, 1000);
  };

  const handleTimeSlotSelection = (selectedTime: string) => {
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
      }, 2000);
    }, 1000);
  };

  const handleFeedbackQuestion = () => {
    if (currentFeedbackQuestion < feedbackQuestions.length) {
      const question = feedbackQuestions[currentFeedbackQuestion];
      
      addBotMessage(question.question);
      setInstallationStep("feedback");
    } else {
      // All feedback questions completed
      const { positiveAnswers, feedbackScore } = calculateFeedbackScore(feedbackData);
      
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
      }, 2000);
    }
  };

  const handleFeedbackResponse = (isPositive: boolean) => {
    if (currentFeedbackQuestion < feedbackQuestions.length) {
      const currentQuestion = feedbackQuestions[currentFeedbackQuestion];
      const key = currentQuestion.key as keyof FeedbackData;
      
      setFeedbackData(prev => ({
        ...prev,
        [key]: isPositive
      }));
      
      // Show coin earned for each positive answer
      if (isPositive) {
        addBotMessage(`You earned 1 Service Coin! 🪙`, true);
      }
      
      // Move to next question
      setCurrentFeedbackQuestion(currentFeedbackQuestion + 1);
      setTimeout(() => {
        handleFeedbackQuestion();
      }, 500);
    }
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
      const newTotalCoins = earnedCoins + additionalCoins;
      setEarnedCoins(newTotalCoins);
      
      // Hide text feedback form
      setShowTextFeedback(false);
      
      // Show confirmation and total coins earned
      setTimeout(() => {
        addSystemMessage(
          <div className="space-y-2">
            <p className="font-medium">✅ Feedback Submitted - Thank You!</p>
            <p>Thank you for your detailed feedback! You've earned <strong>{additionalCoins} extra Service Coins</strong>!</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
              <div className="flex items-center gap-2 text-yellow-700">
                <Coins className="h-5 w-5 text-yellow-500" />
                <p className="font-semibold">Total Service Coins Earned: {newTotalCoins}</p>
              </div>
              <p className="text-sm mt-1 text-yellow-600">Collect 100 coins to redeem for 3 free paper rolls!</p>
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

  const skipTextFeedback = () => {
    setShowTextFeedback(false);
    addBotMessage("Is there anything else I can help you with?");
    showMainMenu();
  };

  const resetInstallationFlow = () => {
    setInstallationStep("merchantId");
    setCurrentRequest({});
    setMerchantInfo(null);
    setCurrentFeedbackQuestion(0);
    setFeedbackData({});
    setShowTextFeedback(false);
    setTextFeedback("");
  };

  return {
    installationStep,
    merchantInfo,
    currentRequest,
    otp,
    setOtp,
    currentFeedbackQuestion,
    feedbackData,
    earnedCoins,
    setEarnedCoins,
    showTextFeedback,
    setShowTextFeedback,
    textFeedback,
    setTextFeedback,
    handleMerchantIdInput,
    handleOtpVerification,
    handlePosTypeSelection,
    handleTimeSlotSelection,
    handleFeedbackQuestion,
    handleFeedbackResponse,
    handleTextFeedbackSubmit,
    skipTextFeedback,
    resetInstallationFlow
  };
};
