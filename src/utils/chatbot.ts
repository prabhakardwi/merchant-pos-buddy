
import { CHATBOT_NAME, FAQ_ITEMS } from "../constants/chatbot";
import { FAQItem } from "../types/chatbot";

// Generate a random ticket number
export function generateTicketNumber(): string {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `SR${datePart}${randomPart}`;
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Get date one month from now in YYYY-MM-DD format
export function getOneMonthFromNow(): string {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now.toISOString().split('T')[0];
}

// Check if a string contains any keywords from an array
export function containsKeywords(text: string, keywords: string[]): boolean {
  const lowercaseText = text.toLowerCase();
  return keywords.some(keyword => lowercaseText.includes(keyword.toLowerCase()));
}

// Find an FAQ match based on user input
export function findFAQMatch(userInput: string): FAQItem | undefined {
  return FAQ_ITEMS.find(faq => containsKeywords(userInput, faq.keywords));
}

// Format message with bot name and timestamp
export function formatBotMessage(message: string): string {
  return `${message}`;
}
