
import React from "react";
import { Button } from "@/components/ui/button";
import { Option } from "@/types/chatbot";

interface OptionButtonsProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

// Array of light background colors for the options
const LIGHT_COLORS = [
  "bg-[#F2FCE2]", // Soft Green
  "bg-[#FEF7CD]", // Soft Yellow
  "bg-[#FEC6A1]", // Soft Orange
  "bg-[#E5DEFF]", // Soft Purple
  "bg-[#FFDEE2]", // Soft Pink
  "bg-[#FDE1D3]", // Soft Peach
  "bg-[#D3E4FD]", // Soft Blue
  "bg-[#F1F0FB]", // Soft Gray
];

const OptionButtons: React.FC<OptionButtonsProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 mt-3 mb-4 justify-start">
      {options.map((option, index) => (
        <Button
          key={option.id}
          variant="outline"
          className={`${LIGHT_COLORS[index % LIGHT_COLORS.length]} hover:opacity-90 border border-gray-200 text-brand-dark w-[140px] h-[80px] flex flex-col items-center justify-center p-3 rounded-lg shadow-sm transition-all hover:shadow-md`}
          onClick={() => onSelect(option)}
        >
          <span className="text-sm font-medium text-center">{option.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default OptionButtons;
