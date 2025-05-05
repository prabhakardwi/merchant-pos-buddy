
import { MerchantInfo } from "@/types/chatbot";

// Fetch merchant information (mock function that would be replaced with API call in production)
export const fetchMerchantInfo = (merchantId: string): MerchantInfo => {
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
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate a random service engineer
export const getServiceEngineer = (): { name: string; mobile: string } => {
  const names = ["Alex Smith", "Jamie Johnson", "Chris Wilson", "Taylor Brown", "Jordan Lee"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const mobile = `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  
  return { name: randomName, mobile };
};
