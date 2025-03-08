
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Settings, 
  MessageSquare, 
  RefreshCcw,
  BarChart4,
  ZapOff,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Gauge,
  CpuIcon,
  Wrench,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConsumerPanelProps {
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  messageCount: number;
  processingDelay: number;
  onProcessingDelayChange: (delay: number) => void;
  onBatchProcess?: () => void;
  className?: string;
}

interface ProcessingStat {
  timestamp: number;
  value: number;
}

const MAX_STATS_HISTORY = 20;

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
  const [resourceUsage, setResourceUsage] = useState({
    cpu: 10,
    memory: 15
  });
  const [throughputHistory, setThroughputHistory] = useState<ProcessingStat[]>([]);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [autoScale, setAutoScale] = useState(false);
  
  // Simulate processing based on messages in queue
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && messageCount > 0) {
      interval = setInterval(() => {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          
          // Update processed count
          setProcessingStats(prev => {
            const newProcessed = prev.processed + 1;
            const newAvgTime = (prev.avgProcessingTime * prev.processed + processingDelay) / newProcessed;
            
            // Add to throughput history
            const now = Date.now();
            setThroughputHistory(prevHistory => {
              const newHistory = [...prevHistory, { timestamp: now, value: 1 }];
              return newHistory.slice(-MAX_STATS_HISTORY);
            });
            
            return {
              ...prev,
              processed: newProcessed,
              avgProcessingTime: newAvgTime
            };
          });
          
          // Simulate resource usage change
          setResourceUsage(prev => {
            const cpuChange = messageCount > 5 ? 5 : 2;
            const memoryChange = 1;
            return {
              cpu: Math.min(95, prev.cpu + cpuChange),
              memory: Math.min(90, prev.memory + memoryChange)
            };
          });
          
        }, 500);
      }, processingDelay);
    } else {
      // When idle, gradually decrease resource usage
      interval = setInterval(() => {
        setResourceUsage(prev => ({
          cpu: Math.max(10, prev.cpu - 2),
          memory: Math.max(15, prev.memory - 1)
        }));
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, messageCount, processingDelay]);

  // Simulate occasional consumer health fluctuations
  useEffect(() => {
    const healthInterval = setInterval(() => {
      const healthChange = Math.random() > 0.7 ? 
        -Math.floor(Math.random() * 5) : 
        Math.floor(Math.random() * 2);
      
      setConsumerHealth(prev => {
        const newHealth = Math.max(70, Math.min(100, prev + healthChange));
        // If health is low, add some errors occasionally
        if (newHealth < 80 && Math.random() > 0.7) {
          setProcessingStats(prevStats => ({
            ...prevStats,
            errors: prevStats.errors + 1
          }));
        }
        return newHealth;
      });
    }, 5000);
    
    return () => clearInterval(healthInterval);
  }, []);
  
  // Auto-scaling effect
  useEffect(() => {
    if (!autoScale) return;
    
    let autoScaleTimeout: NodeJS.Timeout | null = null;
    
    // If queue is growing and resource usage is high, reduce processing delay
    if (messageCount > 5 && resourceUsage.cpu > 70 && processingDelay > 1500) {
      autoScaleTimeout = setTimeout(() => {
        onProcessingDelayChange(Math.max(1000, processingDelay - 500));
        toast.info("Auto-scaling: Increased processing speed");
      }, 3000);
    } 
    // If queue is empty and resource usage is low, increase processing delay to save resources
    else if (messageCount === 0 && resourceUsage.cpu < 30 && processingDelay < 4000) {
      autoScaleTimeout = setTimeout(() => {
        onProcessingDelayChange(Math.min(5000, processingDelay + 500));
        toast.info("Auto-scaling: Decreased processing speed to save resources");
      }, 3000);
    }
    
    return () => {
      if (autoScaleTimeout) clearTimeout(autoScaleTimeout);
    };
  }, [messageCount, resourceUsage.cpu, processingDelay, autoScale, onProcessingDelayChange]);

  const speedUpProcessing = () => {
    if (processingDelay <= 1000) return;
    onProcessingDelayChange(processingDelay - 500);
  };
  
  const slowDownProcessing = () => {
    if (processingDelay >= 5000) return;
    onProcessingDelayChange(processingDelay + 500);
  };
  
  // Get battery icon based on health
  const getBatteryIcon = () => {
    if (consumerHealth > 90) return <BatteryCharging className="w-4 h-4 text-green-500" />;
    if (consumerHealth > 80) return <Battery className="w-4 h-4 text-yellow-500" />;
    return <BatteryWarning className="w-4 h-4 text-red-500" />;
  };

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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Processing Delay
            </span>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6" 
                    disabled={processingDelay <= 1000 || !isActive}
                    onClick={speedUpProcessing}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Speed up (decrease delay)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6" 
                    disabled={processingDelay >= 5000 || !isActive}
                    onClick={slowDownProcessing}
                  >
                    <MinusCircle className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Slow down (increase delay)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
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
            <span className="text-xs flex items-center gap-1">
              {consumerHealth}% {getBatteryIcon()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex flex-col gap-1 p-2 rounded bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Resource Usage</span>
              <CpuIcon className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>CPU</span>
                <span className={cn(
                  resourceUsage.cpu > 80 ? "text-red-500" : 
                  resourceUsage.cpu > 60 ? "text-amber-500" : "text-green-500"
                )}>
                  {resourceUsage.cpu}%
                </span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full",
                    resourceUsage.cpu > 80 ? "bg-red-500" : 
                    resourceUsage.cpu > 60 ? "bg-amber-500" : "bg-green-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${resourceUsage.cpu}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Memory</span>
                <span>{resourceUsage.memory}%</span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${resourceUsage.memory}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
              <span className="text-xs text-muted-foreground">Processed</span>
              <span className="text-xl font-semibold">{processingStats.processed}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30">
              <span className="text-xs text-muted-foreground">Errors</span>
              <span className={cn(
                "text-xl font-semibold",
                processingStats.errors > 0 && "text-red-500"
              )}>
                {processingStats.errors}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded bg-muted/30 col-span-2">
              <span className="text-xs text-muted-foreground">Avg. Time</span>
              <span className="text-xl font-semibold">
                {(processingStats.avgProcessingTime / 1000).toFixed(1)}s
              </span>
            </div>
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
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
          >
            <Wrench className="w-3 h-3 mr-1" />
            {showAdvancedControls ? "Hide" : "Show"} Advanced
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Auto-scale</span>
            <Switch 
              checked={autoScale} 
              onCheckedChange={setAutoScale}
              disabled={!isActive}
            />
          </div>
        </div>
        
        {showAdvancedControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-md p-3 space-y-2 bg-muted/30"
          >
            <div className="text-xs font-medium">Throughput Metrics</div>
            <div className="h-12 flex items-end gap-[2px]">
              {throughputHistory.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No data yet
                </div>
              ) : (
                throughputHistory.map((stat, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-primary/70 rounded-t"
                    style={{ 
                      height: `${Math.max(20, stat.value * 40)}%`,
                      opacity: 0.3 + (i / throughputHistory.length) * 0.7
                    }}
                  />
                ))
              )}
            </div>
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Past</span>
              <span>Recent</span>
            </div>
          </motion.div>
        )}
        
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
        
        {isActive && consumerHealth < 80 && (
          <div className="flex items-center gap-2 p-2 rounded bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            <ZapOff className="w-4 h-4" />
            <span className="text-xs">Consumer health is degraded, errors may occur</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ConsumerPanel;
