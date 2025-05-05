
import { FAQItem, Option, FeedbackQuestion } from "@/types/chatbot";
import React from "react";

export const CHATBOT_NAME = "HDFC POS Support";

export const GREETING_MESSAGE = "Hello! Welcome to HDFC Bank's POS Machine Support. How can I assist you today?";

export const MAIN_MENU_OPTIONS: Option[] = [
  { id: "installation", label: "Request POS Installation", value: "installation" },
  { id: "deinstallation", label: "Request POS Deinstallation", value: "deinstallation" },
  { id: "maintenance", label: "Request POS Maintenance", value: "maintenance" },
  { id: "reactivation", label: "Request POS Reactivation", value: "reactivation" },
  { id: "faq", label: "Frequently Asked Questions", value: "faq" }
];

export const FAQ_MENU_OPTIONS: Option[] = [
  { id: "faq-1", label: "How long does installation take?", value: "installation time" },
  { id: "faq-2", label: "What documents are required?", value: "documents required" },
  { id: "faq-3", label: "Is there a maintenance fee?", value: "maintenance fee" },
  { id: "faq-4", label: "How do I report issues?", value: "report issues" },
  { id: "faq-5", label: "How to check transaction status?", value: "transaction status" }
];

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  "installation": "Installation",
  "deinstallation": "Deinstallation",
  "reactivation": "Reactivation",
  "maintenance": "Maintenance"
};

export const TIME_SLOTS: string[] = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM"
];

export const feedbackQuestions: FeedbackQuestion[] = [
  { key: "scheduledDateMet", question: "Was the installation done on the scheduled date?", positiveDetail: "Great to hear we met the schedule!" },
  { key: "engineerProfessional", question: "Was the engineer polite and professional?", positiveDetail: "We're glad our team provided professional service!" },
  { key: "properInstallation", question: "Was the device installed properly?", positiveDetail: "Excellent! Quality installation is our priority." },
  { key: "trainingProvided", question: "Was the demo/training provided?", positiveDetail: "Wonderful! Training is essential for optimal usage." },
  { key: "merchantIdShared", question: "Were TIDs and merchant IDs shared?", positiveDetail: "Perfect! Having your IDs is important." }
];

export const FEEDBACK_QUESTIONS = feedbackQuestions;

export const COMMENTS_PROMPT = "We would appreciate if you could share any additional comments about our service.";

// Add the missing SERVICE_REQUEST_FIELDS constant
export const SERVICE_REQUEST_FIELDS = {
  merchantName: {
    label: "Merchant Name",
    placeholder: "Enter your business name"
  },
  merchantId: {
    label: "Merchant ID",
    placeholder: "Enter your merchant ID"
  },
  serialNumber: {
    label: "POS Serial Number",
    placeholder: "Enter POS machine serial number"
  },
  requestType: {
    label: "Request Type",
    placeholder: "Select request type"
  },
  preferredDate: {
    label: "Preferred Date",
    placeholder: "Select preferred date"
  },
  preferredTime: {
    label: "Preferred Time",
    placeholder: "Select preferred time"
  },
  contactName: {
    label: "Contact Person",
    placeholder: "Enter contact person name"
  },
  contactMobile: {
    label: "Contact Mobile",
    placeholder: "Enter 10-digit mobile number"
  }
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    keywords: ["installation", "setup", "install"],
    question: "How long does a POS installation take?",
    answer: "A typical POS installation takes about 30-45 minutes. Our technician will set up the hardware, configure the software, and provide a brief demonstration of how to use the system."
  },
  {
    keywords: ["documents", "require", "paperwork", "kyc"],
    question: "What documents are required for POS installation?",
    answer: "For POS installation, you'll need to provide: 1) Business Registration Certificate, 2) Bank Account Details, 3) Owner's ID Proof, 4) GST Registration (if applicable), and 5) Cancelled Cheque."
  },
  {
    keywords: ["maintenance", "fee", "charges", "cost"],
    question: "Is there a maintenance fee for the POS machine?",
    answer: "Yes, there is a small monthly maintenance fee for the POS machine. The exact amount depends on your business type and transaction volume. This fee covers software updates, technical support, and basic hardware maintenance."
  },
  {
    keywords: ["issue", "problem", "report", "not working"],
    question: "How do I report issues with my POS machine?",
    answer: "You can report POS machine issues through our 24/7 helpline at 1800-XXX-XXXX, through this chatbot by selecting 'Request POS Maintenance', or by visiting your nearest HDFC branch. Please keep your merchant ID ready for faster service."
  },
  {
    keywords: ["transaction", "status", "payment", "settlement"],
    question: "How can I check transaction status or settlement?",
    answer: "You can check transaction status and settlements through: 1) Your Merchant Portal at merchant.hdfc.com, 2) The HDFC Merchant App, or 3) By contacting customer support with your transaction reference number."
  },
  {
    keywords: ["refund", "return", "chargeback"],
    question: "How do I process a refund on the POS machine?",
    answer: "To process a refund: 1) Press the 'Menu' button on your POS machine, 2) Select 'Refund' option, 3) Enter the transaction amount, 4) Swipe/insert customer's card, 5) Have customer enter PIN if prompted, 6) Provide the customer with a refund receipt."
  },
  {
    keywords: ["paper", "receipt", "roll"],
    question: "How do I replace the paper roll in my POS machine?",
    answer: "To replace the paper roll: 1) Open the paper compartment by pressing the release button, 2) Remove the old roll core, 3) Insert the new paper roll with the paper feeding from underneath, 4) Pull a small length of paper out and close the cover, 5) Press the paper feed button to ensure it advances properly."
  },
  {
    keywords: ["batch", "settlement", "close", "end of day"],
    question: "How do I perform batch settlement/closing?",
    answer: "To perform batch settlement: 1) Press the 'Menu' or 'Function' button, 2) Select 'Settlement' or 'Batch Close', 3) Enter your manager password if prompted, 4) The terminal will connect to the bank and process all transactions, 5) A settlement report will print. We recommend doing this at the end of each business day."
  }
];
