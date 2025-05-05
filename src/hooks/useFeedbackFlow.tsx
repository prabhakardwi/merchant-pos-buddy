
import { useState } from "react";
import { FeedbackData, InstallationStep } from "@/types/chatbot";
import { FEEDBACK_QUESTIONS } from "@/constants/chatbot";
import { toast } from "@/hooks/use-toast";

interface FeedbackFlowProps {
  addUserMessage: (content: string | React.ReactNode) => void;
  addBotMessage: (content: string | React.ReactNode, showCoin?: boolean) => void;
  addSystemMessage: (content: string | React.ReactNode, showCoin?: boolean) => void;
  setCurrentOptions: (options: any[]) => void;
  setShowOptions: (show: boolean) => void;
  setInstallationStep: (step: InstallationStep) => void;
  setInputDisabled: (disabled: boolean) => void;
  showMainMenu: () => void;
}

const useFeedbackFlow = ({
  addUserMessage,
  addBotMessage,
  addSystemMessage,
  setCurrentOptions,
  setShowOptions,
  setInstallationStep,
  setInputDisabled,
  showMainMenu
}: FeedbackFlowProps) => {
  const [currentFeedbackQuestion, setCurrentFeedbackQuestion] = useState<number>(0);
  const [feedbackData, setFeedbackData] = useState<Partial<FeedbackData>>({});
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [showTextFeedback, setShowTextFeedback] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false); 
  const [comments, setComments] = useState<string>("");

  // Handle feedback questions flow
  const handleFeedbackQuestion = () => {
    const { feedbackQuestions } = require("@/constants/chatbot");
    
    if (currentFeedbackQuestion < feedbackQuestions.length) {
      const question = feedbackQuestions[currentFeedbackQuestion];
      
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
      const feedbackScore = Math.round((positiveAnswers / feedbackQuestions.length) * 100);
      
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
              <span className="h-5 w-5 text-yellow-500">🪙</span>
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
                <span className="h-4 w-4 text-yellow-500">🪙</span>
                <p className="font-medium text-yellow-700">Share your comments to earn 5 extra Service Coins!</p>
              </div>
            </div>
            <p>Please provide any additional feedback or suggestions:</p>
          </div>
        );
        setInstallationStep("textFeedback");
        setShowTextFeedback(true);
        setInputDisabled(true); // Disable regular input to force use of the feedback form
      }, 2000);
    }
  };

  // Handle text feedback submission
  const handleTextFeedbackSubmit = () => {
    if (textFeedback.trim()) {
      addUserMessage(textFeedback);
      
      // Update feedback data with text feedback
      setFeedbackData(prev => ({
        ...prev,
        textFeedback: textFeedback
      }));
      
      // Add coins for text feedback
      const additionalCoins = 5;
      const newCoins = earnedCoins + additionalCoins;
      setEarnedCoins(newCoins);
      
      // Hide text feedback form
      setShowTextFeedback(false);
      
      // Show confirmation for text feedback
      addSystemMessage(
        <div className="space-y-2">
          <p className="font-medium">✅ Feedback Submitted - Thank You!</p>
          <p>Thank you for your detailed feedback! You've earned <strong>{additionalCoins} Service Coins</strong>!</p>
        </div>
      , true);
      
      // Show comments section after a short delay
      setTimeout(() => {
        addBotMessage(
          <div className="space-y-2">
            <p>We would appreciate if you could share any additional comments about our service.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2">
              <div className="flex items-center gap-1">
                <span className="h-4 w-4 text-yellow-500">🪙</span>
                <p className="font-medium text-yellow-700">Share your comments to earn 3 extra Service Coins!</p>
              </div>
            </div>
          </div>
        );
        
        setInstallationStep("comments");
        setShowComments(true);
        setInputDisabled(true);
      }, 1000);
    }
  };

  // Handle comments submission
  const handleCommentsSubmit = () => {
    if (comments.trim()) {
      addUserMessage(comments);
      
      // Add coins for providing comments
      const additionalCoins = 3;
      const newTotalCoins = earnedCoins + additionalCoins;
      setEarnedCoins(newTotalCoins);
      
      // Hide comments form and enable regular input
      setShowComments(false);
      setInputDisabled(false);
      
      // Show confirmation and total coins earned
      addSystemMessage(
        <div className="space-y-2">
          <p className="font-medium">✅ Comments Received - Thank You!</p>
          <p>Thank you for your valuable comments! You've earned <strong>{additionalCoins} extra Service Coins</strong>!</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
            <div className="flex items-center gap-2 text-yellow-700">
              <span className="h-5 w-5 text-yellow-500">🪙</span>
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
    }
  };

  return {
    currentFeedbackQuestion,
    setCurrentFeedbackQuestion,
    feedbackData,
    setFeedbackData,
    earnedCoins,
    setEarnedCoins,
    showTextFeedback,
    setShowTextFeedback,
    textFeedback,
    setTextFeedback,
    showComments,
    setShowComments,
    comments,
    setComments,
    handleFeedbackQuestion,
    handleTextFeedbackSubmit,
    handleCommentsSubmit
  };
};

export default useFeedbackFlow;
