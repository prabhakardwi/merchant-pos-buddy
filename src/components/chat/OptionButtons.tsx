
import React from "react";
import { Button } from "@/components/ui/button";
import { Option } from "@/types/chatbot";

interface OptionButtonsProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

const OptionButtons: React.FC<OptionButtonsProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4 justify-start">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          className="bg-white hover:bg-brand-lightBlue border border-gray-200 text-brand-dark"
          onClick={() => onSelect(option)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default OptionButtons;
