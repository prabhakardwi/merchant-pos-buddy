
export type MessageType = 'bot' | 'user' | 'system';

export interface Message {
  id: string;
  type: MessageType;
  content: string | React.ReactNode;
  timestamp: Date;
}

export interface Option {
  id: string;
  label: string;
  value: string;
}

export type RequestType = 'installation' | 'deinstallation' | 'reactivation' | 'maintenance';

export type POSType = 'APOS' | 'ClassicPOS';

export type Language = 'english' | 'hindi' | 'spanish' | 'marathi';

export interface ServiceRequest {
  merchantName: string;
  merchantId: string;
  serialNumber: string;
  requestType: RequestType;
  preferredDate: string;
  preferredTime: string;
  contactName: string;
  contactMobile: string;
  ticketNumber: string;
  posType?: POSType;
  serviceEngineerName?: string;
  serviceEngineerMobile?: string;
  coins?: number;
}

export interface FAQItem {
  keywords: string[];
  question: string;
  answer: string;
}

export interface MerchantInfo {
  id: string;
  businessName: string;
  address: string;
  contactName: string;
  contactMobile: string;
}

export type InstallationStep = 
  | 'merchantId'
  | 'confirmMerchant' 
  | 'otpVerification'
  | 'posTypeSelection'
  | 'timeSlotSelection'
  | 'confirmation';
