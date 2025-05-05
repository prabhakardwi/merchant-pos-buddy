
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

export type Language = 'english' | 'hindi' | 'spanish';

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
  feedback?: FeedbackData;
  coins?: number;
}

export interface FeedbackData {
  scheduledDateMet: boolean;
  engineerProfessional: boolean;
  properInstallation: boolean;
  postInstallationTest: boolean;
  trainingProvided: boolean;
  explanationClear: boolean;
  functionsDemonstrated: boolean;
  installationReportShared: boolean;
  merchantIdShared: boolean;
  textFeedback?: string;
}

export interface FAQItem {
  keywords: string[];
  question: string;
  answer: string;
}

export interface FeedbackQuestion {
  key: string;
  question: string;
  positiveDetail: string;
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
  | 'feedback'
  | 'textFeedback'
  | 'confirmation';
