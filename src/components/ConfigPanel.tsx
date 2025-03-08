import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Settings, 
  Database, 
  Network, 
  RefreshCcw, 
  ClipboardList,
  HardDrive,
  ArrowDownUp,
  Gauge,
  Cpu,
  Clock
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface ConfigPanelProps {
  className?: string;
}

export interface BrokerConfig {
  brokerType: 'rabbitmq' | 'kafka' | 'activemq';
  persistence: 'memory' | 'disk';
  exchangeType: 'direct' | 'topic' | 'fanout';
  compression: boolean;
  retentionHours: number;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ className }) => {
  const [config, setConfig] = useState<BrokerConfig>(() => {
    try {
      const savedConfig = localStorage.getItem('brokerConfig');
      return savedConfig ? JSON.parse(savedConfig) : {
        brokerType: 'rabbitmq',
        persistence: 'memory',
        exchangeType: 'direct',
        compression: false,
        retentionHours: 24
      };
    } catch (e) {
      console.error('Failed to load broker config:', e);
      return {
        brokerType: 'rabbitmq',
        persistence: 'memory',
        exchangeType: 'direct',
        compression: false,
        retentionHours: 24
      };
    }
  });
  
  const [systemStats, setSystemStats] = useState({
    connections: 2,
    channels: 4,
    messagesPerSecond: 12.5,
    memoryUsage: 24,
    uptime: '2h 15m',
    queueSize: 8
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    localStorage.setItem('brokerConfig', JSON.stringify(config));
  }, [config]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        connections: Math.floor(Math.random() * 3) + 1,
        channels: Math.floor(Math.random() * 4) + 2,
        messagesPerSecond: +(Math.random() * 20 + 5).toFixed(1),
        memoryUsage: Math.floor(Math.random() * 10) + 20,
        uptime: prev.uptime,
        queueSize: Math.floor(Math.random() * 15)
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleConfigChange = <K extends keyof BrokerConfig>(key: K, value: BrokerConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApplyConfig = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Configuration applied successfully");
    }, 1200);
  };
  
  const handleRefreshStats = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setSystemStats({
        connections: Math.floor(Math.random() * 3) + 1,
        channels: Math.floor(Math.random() * 4) + 2,
        messagesPerSecond: +(Math.random() * 20 + 5).toFixed(1),
        memoryUsage: Math.floor(Math.random() * 10) + 20,
        uptime: systemStats.uptime,
        queueSize: Math.floor(Math.random() * 15)
      });
      setIsUpdating(false);
      toast.info("System stats refreshed");
    }, 800);
  };
  
  const handlePurgeQueues = () => {
    if (confirm("Are you sure you want to purge all queues? This will remove all pending messages.")) {
      setIsUpdating(true);
      
      setTimeout(() => {
        setIsUpdating(false);
        toast.success("All queues purged successfully");
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "rounded-lg border bg-background p-4 h-full flex flex-col",
        isUpdating && "opacity-70 pointer-events-none",
        className
      )}
    >
      <Tabs defaultValue="broker" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="broker" className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span>Broker</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="broker" className="space-y-4 flex-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="broker-type" className="text-sm font-medium flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-muted-foreground" />
                Broker Type
              </label>
              <Select 
                value={config.brokerType} 
                onValueChange={(value: 'rabbitmq' | 'kafka' | 'activemq') => handleConfigChange('brokerType', value)}
              >
                <SelectTrigger id="broker-type">
                  <SelectValue placeholder="Select broker type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rabbitmq" className="flex items-center">
                    RabbitMQ
                  </SelectItem>
                  <SelectItem value="kafka" className="flex items-center">
                    Kafka
                  </SelectItem>
                  <SelectItem value="activemq" className="flex items-center">
                    ActiveMQ
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {config.brokerType === 'rabbitmq' 
                  ? "AMQP-based message broker with advanced routing capabilities"
                  : config.brokerType === 'kafka'
                  ? "Distributed streaming platform with high throughput"
                  : "JMS-based message broker with cross-language support"
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="persistence" className="text-sm font-medium flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-muted-foreground" />
                Persistence
              </label>
              <Select 
                value={config.persistence} 
                onValueChange={(value: 'memory' | 'disk') => handleConfigChange('persistence', value)}
              >
                <SelectTrigger id="persistence">
                  <SelectValue placeholder="Select persistence type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memory">In-Memory</SelectItem>
                  <SelectItem value="disk">Disk</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {config.persistence === 'memory' 
                  ? "Faster but messages are lost on broker restart"
                  : "Slower but provides durability between restarts"
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="exchange-type" className="text-sm font-medium flex items-center gap-1.5">
                <ArrowDownUp className="w-3.5 h-3.5 text-muted-foreground" />
                Exchange Type
              </label>
              <Select 
                value={config.exchangeType} 
                onValueChange={(value: 'direct' | 'topic' | 'fanout') => handleConfigChange('exchangeType', value)}
              >
                <SelectTrigger id="exchange-type">
                  <SelectValue placeholder="Select exchange type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="topic">Topic</SelectItem>
                  <SelectItem value="fanout">Fanout</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {config.exchangeType === 'direct' 
                  ? "Routes messages to queues based on routing key"
                  : config.exchangeType === 'topic'
                  ? "Routes messages based on wildcard pattern matching"
                  : "Broadcasts messages to all bound queues"
                }
              </p>
            </div>
            
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="compression" className="text-sm font-medium flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                  Message Compression
                </label>
                <Switch 
                  id="compression"
                  checked={config.compression}
                  onCheckedChange={(checked) => handleConfigChange('compression', checked)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="retention" className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  Message Retention (hours)
                </label>
                <Input
                  id="retention"
                  type="number"
                  min="1"
                  max="168"
                  value={config.retentionHours}
                  onChange={(e) => handleConfigChange('retentionHours', parseInt(e.target.value) || 24)}
                  className="h-9"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleApplyConfig}
            className="w-full"
          >
            {isUpdating ? (
              <span className="flex items-center gap-1">
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Applying...
              </span>
            ) : "Apply Configuration"}
          </Button>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 rounded-md bg-secondary/70 hover:bg-secondary transition-colors">
                  <h3 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Network className="w-3 h-3" />
                    Connections
                  </h3>
                  <p className="text-xl font-semibold">{systemStats.connections}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Number of active client connections</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 rounded-md bg-secondary/70 hover:bg-secondary transition-colors">
                  <h3 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <ArrowDownUp className="w-3 h-3" />
                    Channels
                  </h3>
                  <p className="text-xl font-semibold">{systemStats.channels}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Open communication channels</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 rounded-md bg-secondary/70 hover:bg-secondary transition-colors">
                  <h3 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <BarChart className="w-3 h-3" />
                    Messages/s
                  </h3>
                  <p className="text-xl font-semibold">{systemStats.messagesPerSecond}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Current message throughput</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 rounded-md bg-secondary/70 hover:bg-secondary transition-colors">
                  <h3 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    Memory
                  </h3>
                  <p className="text-xl font-semibold">{systemStats.memoryUsage}MB</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Current memory consumption</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 rounded-md bg-secondary/70 hover:bg-secondary transition-colors col-span-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Uptime
                    </h3>
                    <h3 className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" />
                      Queue Size
                    </h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold">{systemStats.uptime}</p>
                    <p className="text-xl font-semibold">{systemStats.queueSize}</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">System operational time and current queue size</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="h-12 bg-secondary/40 rounded-md overflow-hidden">
              <motion.div 
                className="h-full bg-primary/20"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, systemStats.messagesPerSecond * 5)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 msg/s</span>
              <span>10 msg/s</span>
              <span>20 msg/s</span>
            </div>
          </div>
          
          <div className="flex justify-between gap-2 mt-auto">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleRefreshStats}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCcw className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-1" />
              )}
              Refresh Stats
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handlePurgeQueues}
              disabled={isUpdating}
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Purge Queues
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ConfigPanel;
