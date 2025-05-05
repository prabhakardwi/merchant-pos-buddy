
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
