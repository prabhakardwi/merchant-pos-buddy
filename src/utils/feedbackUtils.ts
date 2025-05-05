
import { FeedbackData } from "@/types/chatbot";

// Feedback questions array
export const feedbackQuestions = [
  { key: "scheduledDateMet", question: "Was the installation done on the scheduled date?" },
  { key: "engineerProfessional", question: "Was the engineer polite and professional?" },
  { key: "properInstallation", question: "Was the device installed properly and did the engineer show you the test transaction slip?" },
  { key: "postInstallationTest", question: "Was the POS machine tested post-installation?" },
  { key: "trainingProvided", question: "Was the demo/training provided?" },
  { key: "explanationClear", question: "Was the explanation of device usage clear?" },
  { key: "functionsDemonstrated", question: "Were all functions (print, card swipe, QR scan, etc.) demonstrated?" },
  { key: "installationReportShared", question: "Was an installation report shared or signed?" },
  { key: "merchantIdShared", question: "Were TIDs and merchant IDs shared?" }
];

// Calculate feedback score and coins
export const calculateFeedbackScore = (feedbackData: Partial<FeedbackData>): {
  positiveAnswers: number;
  feedbackScore: number;
} => {
  const positiveAnswers = Object.values(feedbackData).filter(value => value === true).length;
  const feedbackScore = Math.round((positiveAnswers / feedbackQuestions.length) * 100);
  
  return {
    positiveAnswers,
    feedbackScore
  };
};
