
import { useState } from "react";
import { ServiceRequest, RequestType } from "@/types/chatbot";
import { REQUEST_TYPE_LABELS } from "@/constants/chatbot";
import { toast } from "@/hooks/use-toast";

interface ServiceRequestsProps {
  addBotMessage: (content: string | React.ReactNode) => void;
  setActiveRequestType: (type: RequestType | null) => void;
  setInputDisabled: (disabled: boolean) => void;
  showMainMenu: () => void;
}

const useServiceRequests = ({
  addBotMessage,
  setActiveRequestType,
  setInputDisabled,
  showMainMenu
}: ServiceRequestsProps) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  
  // Initialize service request flow
  const handleServiceRequestInit = (requestType: RequestType) => {
    const requestName = REQUEST_TYPE_LABELS[requestType];
    
    addBotMessage(`Let's process your ${requestName} request. Please fill out the following form:`);
    setActiveRequestType(requestType);
    setShowForm(true);
    setInputDisabled(true);
  };
  
  // Handle service request completion
  const handleServiceRequestComplete = (request: ServiceRequest) => {
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    
    // Show confirmation message with ticket details
    const requestName = REQUEST_TYPE_LABELS[request.requestType];
    
    const SystemMessage = (
      <div className="space-y-2">
        <p className="font-medium">✅ {requestName} Request Submitted</p>
        <p>Your service ticket has been created:</p>
        <p className="bg-brand-lightBlue p-2 rounded text-center font-bold">
          Ticket #{request.ticketNumber}
        </p>
        <p>Our team will contact {request.contactName} at {request.contactMobile} to confirm the {request.preferredDate} appointment during {request.preferredTime}.</p>
      </div>
    );
    
    // Add the system message directly
    addBotMessage(SystemMessage);

    toast({
      title: "Request Submitted",
      description: `Your ticket #${request.ticketNumber} has been created.`,
      duration: 5000,
    });
    
    setTimeout(() => {
      addBotMessage("Is there anything else I can help you with?");
      showMainMenu();
    }, 1500);
  };
  
  // Handle service request cancellation
  const handleServiceRequestCancel = () => {
    setShowForm(false);
    setActiveRequestType(null);
    setInputDisabled(false);
    
    addBotMessage("Request cancelled. How else can I assist you today?");
    showMainMenu();
  };
  
  return {
    showForm,
    setShowForm,
    handleServiceRequestInit,
    handleServiceRequestComplete,
    handleServiceRequestCancel
  };
};

export default useServiceRequests;
