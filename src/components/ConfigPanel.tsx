
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

interface ConfigPanelProps {
  className?: string;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "rounded-lg border bg-background p-4",
        className
      )}
    >
      <Tabs defaultValue="broker">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="broker">Broker Config</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="broker" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="broker-type" className="text-sm font-medium">Broker Type</label>
            <Select defaultValue="rabbitmq">
              <SelectTrigger id="broker-type">
                <SelectValue placeholder="Select broker type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rabbitmq">RabbitMQ</SelectItem>
                <SelectItem value="kafka">Kafka</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="persistence" className="text-sm font-medium">Persistence</label>
            <Select defaultValue="memory">
              <SelectTrigger id="persistence">
                <SelectValue placeholder="Select persistence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="memory">In-Memory</SelectItem>
                <SelectItem value="disk">Disk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="exchange-type" className="text-sm font-medium">Exchange Type</label>
            <Select defaultValue="direct">
              <SelectTrigger id="exchange-type">
                <SelectValue placeholder="Select exchange type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="topic">Topic</SelectItem>
                <SelectItem value="fanout">Fanout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => toast.success("Configuration saved successfully")}
            className="w-full"
          >
            Apply Configuration
          </Button>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-secondary">
              <h3 className="text-sm font-medium mb-2">Connections</h3>
              <p className="text-2xl font-semibold">2</p>
            </div>
            
            <div className="p-4 rounded-md bg-secondary">
              <h3 className="text-sm font-medium mb-2">Channels</h3>
              <p className="text-2xl font-semibold">4</p>
            </div>
            
            <div className="p-4 rounded-md bg-secondary">
              <h3 className="text-sm font-medium mb-2">Messages/s</h3>
              <p className="text-2xl font-semibold">12.5</p>
            </div>
            
            <div className="p-4 rounded-md bg-secondary">
              <h3 className="text-sm font-medium mb-2">Memory</h3>
              <p className="text-2xl font-semibold">24MB</p>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => toast.info("System stats refreshed")}
            >
              Refresh Stats
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={() => toast.info("All system queues purged")}
            >
              Purge Queues
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ConfigPanel;
