
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface ConsumerPanelProps {
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  messageCount: number;
  processingDelay: number;
  onProcessingDelayChange: (delay: number) => void;
  className?: string;
}

const ConsumerPanel: React.FC<ConsumerPanelProps> = ({
  isActive,
  onToggleActive,
  messageCount,
  processingDelay,
  onProcessingDelayChange,
  className
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && messageCount > 0) {
      interval = setInterval(() => {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
        }, 500);
      }, processingDelay);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, messageCount, processingDelay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        "rounded-lg border bg-background p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Consumer</h2>
          <p className="text-sm text-muted-foreground">Process messages from the queue</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            !isActive ? "bg-red-500" : 
            isProcessing ? "bg-yellow-500 animate-pulse-subtle" : 
            "bg-green-500"
          )}></div>
          <span className="text-xs">
            {!isActive ? "Inactive" : isProcessing ? "Processing..." : "Listening"}
          </span>
        </div>
      </div>
      
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Consumer Status</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{isActive ? "Active" : "Inactive"}</span>
            <Switch checked={isActive} onCheckedChange={onToggleActive} />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Processing Delay</span>
          <div className="flex items-center gap-4">
            <Slider
              value={[processingDelay]}
              min={1000}
              max={5000}
              step={500}
              onValueChange={(value) => onProcessingDelayChange(value[0])}
              disabled={!isActive}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-16 text-right">
              {processingDelay / 1000}s
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">Queue Status</span>
          <Badge variant={messageCount > 0 ? "secondary" : "outline"}>
            {messageCount} message{messageCount !== 1 ? 's' : ''} in queue
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsumerPanel;
