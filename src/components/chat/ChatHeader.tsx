
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, RotateCcw, Coins } from "lucide-react";

interface ChatHeaderProps {
  earnedCoins: number;
  onRestart: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ earnedCoins, onRestart }) => {
  return (
    <div className="bg-brand-blue text-white p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-lg font-medium">HDFC- Merchant POS Support</h2>
      </div>
      <div className="flex items-center gap-2">
        {earnedCoins > 0 && (
          <div className="flex items-center gap-1 bg-yellow-400 text-brand-dark px-2 py-1 rounded-full text-sm">
            <Coins className="h-4 w-4" />
            <span>{earnedCoins}</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRestart}
          className="text-white hover:bg-brand-blue/80"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
