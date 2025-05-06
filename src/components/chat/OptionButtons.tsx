
import React from "react";
import { Button } from "@/components/ui/button";
import { Option } from "@/types/chatbot";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  Wrench, 
  HelpCircle,
  Package,
  Coins,
  Clock,
  UserCheck,
  MapPin,
  Languages,
  MessageSquare,
  Calendar,
  CheckCircle,
  Settings,
  Bell,
  AlertCircle,
  BarChart,
  CreditCard,
  Headphones,
  Info,
  Phone
} from "lucide-react";

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

// Map of option IDs to icons
const OPTION_ICONS: Record<string, React.ReactNode> = {
  installation: <Package size={28} />,
  deinstallation: <Download size={28} />,
  reactivation: <RefreshCw size={28} />,
  maintenance: <Wrench size={28} />,
  faq: <HelpCircle size={28} />,
  slot1: <Clock size={28} />,
  slot2: <Calendar size={28} />,
  slot3: <CheckCircle size={28} />,
  yes: <UserCheck size={28} />,
  no: <RefreshCw size={28} />,
  apos: <Coins size={28} />,
  classic: <CreditCard size={28} />,
  merchant_location: <MapPin size={28} />,
  language: <Languages size={28} />,
  contact_us: <MessageSquare size={28} />,
  general: <FileText size={28} />,
  support: <Headphones size={28} />,
  schedule: <Calendar size={28} />,
  settings: <Settings size={28} />,
  alerts: <Bell size={28} />,
  warnings: <AlertCircle size={28} />,
  reports: <BarChart size={28} />,
  info: <Info size={28} />,
  call: <Phone size={28} />
};

const OptionButtons: React.FC<OptionButtonsProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 mt-3 mb-4 justify-start">
      {options.map((option, index) => (
        <Button
          key={option.id}
          variant="outline"
          className={`${LIGHT_COLORS[index % LIGHT_COLORS.length]} hover:opacity-90 border border-gray-200 text-brand-dark w-[140px] h-[80px] flex flex-col items-center justify-center p-3 rounded-lg shadow-sm transition-all hover:shadow-md hover:scale-105 hover:border-brand-blue`}
          onClick={() => onSelect(option)}
        >
          {/* Display icon if available for this option id */}
          <div className="flex items-center justify-center h-8 w-8 mb-1 text-brand-blue">
            {OPTION_ICONS[option.id] || OPTION_ICONS[option.value] || <FileText size={28} />}
          </div>
          <span className="text-sm font-medium text-center mt-1 line-clamp-2">{option.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default OptionButtons;
