
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface TextFeedbackFormProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

const TextFeedbackForm: React.FC<TextFeedbackFormProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  onSkip 
}) => {
  return (
    <div className="bg-white border rounded-lg p-4 mt-4 shadow-sm animate-fade-in">
      <h3 className="font-medium mb-2 text-brand-dark">Additional Feedback</h3>
      <div className="flex items-center gap-2 mb-3 bg-yellow-50 p-2 rounded-md">
        <Coins className="h-5 w-5 text-yellow-500" />
        <p className="text-sm text-yellow-700">
          <span className="font-medium">Earn 5 extra Service Coins!</span> Share your detailed experience.
        </p>
      </div>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Please share your experience and suggestions..."
        className="mb-3"
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSkip}
        >
          Skip
        </Button>
        <Button 
          size="sm"
          onClick={onSubmit}
          disabled={!value.trim()}
        >
          <div className="flex items-center gap-1">
            <span>Submit</span>
            <Coins className="h-4 w-4" />
            <span>+5</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TextFeedbackForm;
