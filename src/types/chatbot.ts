
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
}

export interface FAQItem {
  keywords: string[];
  question: string;
  answer: string;
}
