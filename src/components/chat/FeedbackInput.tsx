
import React from "react";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  title: string;
  placeholder: string;
  coinValue: number;
  variant?: "yellow" | "blue";
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({
  value,
  onChange,
  onSubmit,
  onSkip,
  title,
  placeholder,
  coinValue,
  variant = "yellow"
}) => {
  const borderColor = variant === "blue" ? "border-blue-200" : "border-gray-200";
  const focusBorderColor = variant === "blue" ? "focus:border-blue-400" : "focus:border-gray-400";
  const buttonBgColor = variant === "blue" ? "bg-blue-600 hover:bg-blue-700" : "";

  return (
    <div className={`bg-white border ${borderColor} rounded-lg p-4 mt-4 shadow-sm animate-fade-in`}>
      <h3 className="font-medium mb-2 text-brand-dark">{title}</h3>
      <div className="flex items-center gap-2 mb-3 bg-yellow-50 p-2 rounded-md">
        <Coins className="h-5 w-5 text-yellow-500" />
        <p className="text-sm text-yellow-700">
          <span className="font-medium">Earn {coinValue} extra Service Coins!</span> Share your {variant === "blue" ? "comments" : "detailed experience"}.
        </p>
      </div>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mb-3 min-h-[120px] ${borderColor} ${focusBorderColor}`}
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
          className={buttonBgColor}
        >
          <div className="flex items-center gap-1">
            <span>Submit</span>
            <Coins className="h-4 w-4" />
            <span>+{coinValue}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FeedbackInput;
