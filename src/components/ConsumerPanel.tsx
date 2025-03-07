
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Settings, 
  MessageSquare, 
  Play, 
  Pause,
  RefreshCcw
} from 'lucide-react';

interface ConsumerPanelProps {
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  messageCount: number;
  processingDelay: number;
  onProcessingDelayChange: (delay: number) => void;
  onBatchProcess?: () => void;
  className?: string;
}

const ConsumerPanel: React.FC<ConsumerPanelProps> = ({
  isActive,
  onToggleActive,
  messageCount,
  processingDelay,
  onProcessingDelayChange,
  onBatchProcess,
  className
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [consumerHealth, setConsumerHealth] = useState(100);
  const [processingStats, setProcessingStats] = useState({
    processed: 0,
    errors: 0,
    avgProcessingTime: 0
  });
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && messageCount > 0) {
      interval = setInterval(() => {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setProcessingStats(prev => ({
            ...prev,
            processed: prev.processed + 1,
            avgProcessingTime: 
              (prev.avgProcessingTime * prev.processed + processingDelay) / 
              (prev.processed + 1)
          }));
        }, 500);
      }, processingDelay);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, messageCount, processingDelay]);

  // Simulate occasional consumer health fluctuations
  useEffect(() => {
    const healthInterval = setInterval(() => {
      const healthChange = Math.random() > 0.7 ? -Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2);
      setConsumerHealth(prev => Math.max(70, Math.min(100, prev + healthChange)));
    }, 5000);
    
    return () => clearInterval(healthInterval);
  }, []);

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
          <span className="text-sm font-medium flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Consumer Status
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{isActive ? "Active" : "Inactive"}</span>
            <Switch checked={isActive} onCheckedChange={onToggleActive} />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Processing Delay
          </span>
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
        
        <div className="flex items-center justify-between border-t border-b py-3 my-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Consumer Health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className={cn(
                  "h-full",
                  consumerHealth > 90 ? "bg-green-500" : 
                  consumerHealth > 80 ? "bg-yellow-500" : "bg-red-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${consumerHealth}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs">{consumerHealth}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
            <span className="text-xs text-muted-foreground">Processed</span>
            <span className="text-xl font-semibold">{processingStats.processed}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
            <span className="text-xs text-muted-foreground">Errors</span>
            <span className="text-xl font-semibold">{processingStats.errors}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
            <span className="text-xs text-muted-foreground">Avg. Time</span>
            <span className="text-xl font-semibold">
              {(processingStats.avgProcessingTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Queue Status
          </span>
          <Badge variant={messageCount > 0 ? "secondary" : "outline"} className="h-6">
            {messageCount} message{messageCount !== 1 ? 's' : ''} in queue
          </Badge>
        </div>
        
        {messageCount > 0 && onBatchProcess && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-1"
            onClick={onBatchProcess}
          >
            <RefreshCcw className="w-3 h-3" />
            Process All ({messageCount}) Messages
          </Button>
        )}
        
        {!isActive && messageCount > 0 && (
          <div className="flex items-center gap-2 p-2 rounded bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Messages are queueing up while consumer is inactive</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ConsumerPanel;
