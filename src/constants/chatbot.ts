
import { FAQItem } from "../types/chatbot";

export const CHATBOT_NAME = "POS Buddy";

export const GREETING_MESSAGE = "👋 Hello! I'm your POS support assistant. How can I help you today?";

export const MAIN_MENU_OPTIONS = [
  { id: "installation", label: "Installation Request", value: "installation" },
  { id: "deinstallation", label: "Deinstallation Request", value: "deinstallation" },
  { id: "reactivation", label: "Reactivation Request", value: "reactivation" },
  { id: "maintenance", label: "Preventive Maintenance", value: "maintenance" },
  { id: "faq", label: "Frequently Asked Questions", value: "faq" }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    keywords: ["raise", "request", "submit", "create", "how to"],
    question: "How to raise a request?",
    answer: "You can raise any service request by selecting the relevant option from the main menu."
  },
  {
    keywords: ["helpline", "number", "contact", "phone", "call"],
    question: "What is the helpline number?",
    answer: "Our merchant helpline is available at 1800-XXX-XXXX from 9AM to 9PM."
  },
  {
    keywords: ["ticket", "status", "check", "request"],
    question: "How to check ticket status?",
    answer: "Please provide your service ticket number, and we will fetch the current status."
  },
  {
    keywords: ["not working", "broken", "issue", "problem"],
    question: "My POS is not working",
    answer: "Please raise a reactivation or maintenance request via the bot, and our engineer will contact you."
  },
  {
    keywords: ["time", "long", "duration", "installation"],
    question: "How long does it take for installation?",
    answer: "Installation is typically completed within 24-48 working hours after request submission."
  },
  {
    keywords: ["payment", "process", "transaction", "fees"],
    question: "How do I process a payment?",
    answer: "To process a payment, select the payment option on your POS, enter the amount, and follow the on-screen instructions for card or contactless payment."
  },
  {
    keywords: ["refund", "return", "cancel", "transaction"],
    question: "How do I process a refund?",
    answer: "To process a refund, access the transaction history on your POS, locate the transaction, select 'refund,' and follow the on-screen instructions."
  },
  {
    keywords: ["paper", "receipt", "roll", "change"],
    question: "How to change the receipt paper roll?",
    answer: "To change the paper roll, open the printer compartment, remove the old roll core, insert the new roll with paper feeding from underneath, and close the compartment until it clicks."
  }
];

export const FAQ_MENU_OPTIONS = FAQ_ITEMS.map(item => ({
  id: item.keywords[0],
  label: item.question,
  value: item.question
}));

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
    placeholder: "Enter your POS machine serial number"
  },
  preferredDate: {
    label: "Preferred Date",
    placeholder: "Select your preferred date"
  },
  preferredTime: {
    label: "Preferred Time",
    placeholder: "Select your preferred time"
  },
  contactName: {
    label: "Contact Person",
    placeholder: "Enter contact person name"
  },
  contactMobile: {
    label: "Contact Mobile",
    placeholder: "Enter contact mobile number"
  }
};

export const TIME_SLOTS = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM"
];

// Request type display names
export const REQUEST_TYPE_LABELS = {
  installation: "Installation",
  deinstallation: "Deinstallation",
  reactivation: "Reactivation",
  maintenance: "Preventive Maintenance"
};

// Improved feedback questions for installation experience
export const FEEDBACK_QUESTIONS = [
  { 
    key: "scheduledDateMet", 
    question: "Was the installation completed on the scheduled date and time?",
    positiveDetail: "Punctual service delivery helps merchants plan their business operations efficiently."
  },
  { 
    key: "engineerProfessional", 
    question: "Was the engineer courteous, professional, and properly identified?",
    positiveDetail: "Professional conduct builds trust and ensures a positive merchant experience."
  },
  { 
    key: "properInstallation", 
    question: "Was the POS device installed properly and positioned for convenient use?",
    positiveDetail: "Proper installation ensures smooth operation and reduces future service calls."
  },
  { 
    key: "postInstallationTest", 
    question: "Did the engineer conduct a complete test transaction and show you the test slip?",
    positiveDetail: "Test transactions confirm the system is working properly before the engineer leaves."
  },
  { 
    key: "trainingProvided", 
    question: "Was comprehensive training provided on how to use the POS system?",
    positiveDetail: "Proper training ensures merchants can fully utilize all features of their POS system."
  },
  { 
    key: "explanationClear", 
    question: "Were all your questions answered clearly and thoroughly?",
    positiveDetail: "Clear communication helps merchants understand their new system better."
  },
  { 
    key: "functionsDemonstrated", 
    question: "Were all key functions (printing, card processing, QR payments) demonstrated successfully?",
    positiveDetail: "Demonstration of all functions ensures merchants can operate independently."
  },
  { 
    key: "installationReportShared", 
    question: "Did you receive a completed installation report or digital confirmation?",
    positiveDetail: "Documentation provides a record of completed work for future reference."
  },
  { 
    key: "merchantIdShared", 
    question: "Were all necessary merchant IDs, passwords, and support contacts shared?",
    positiveDetail: "Having all necessary information enables merchants to resolve issues independently."
  }
];
