
import React from "react";
import Chatbot from "@/components/chat/Chatbot";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-brand-dark">
          POS Machine Service Support
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Get help with your POS machine installation, maintenance, and other services
        </p>
        
        <Card className="shadow-md overflow-hidden h-[80vh]">
          <Chatbot />
        </Card>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          © 2025 Merchant POS Buddy | For support call 1800-XXX-XXXX
        </p>
      </div>
    </div>
  );
};

export default Index;
