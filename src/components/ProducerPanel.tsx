
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Save, Copy, Send, MessageCircle, History, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProducerPanelProps {
  onSendMessage: (message: string) => void;
  className?: string;
  recentMessages?: string[];
}

const MESSAGE_TEMPLATES = [
  { id: 'template1', name: 'Order Created', content: '{"event":"order_created","orderId":"ORD-123","items":3,"total":59.99}' },
  { id: 'template2', name: 'Payment Processed', content: '{"event":"payment_processed","orderId":"ORD-123","amount":59.99,"status":"success"}' },
  { id: 'template3', name: 'Shipment Update', content: '{"event":"shipment_update","orderId":"ORD-123","status":"shipped","eta":"2023-09-15"}' },
  { id: 'template4', name: 'User Registered', content: '{"event":"user_registered","userId":"USR-456","email":"user@example.com"}' },
];

const ProducerPanel: React.FC<ProducerPanelProps> = ({ 
  onSendMessage, 
  className,
  recentMessages = []
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message to send");
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      onSendMessage(message);
      setMessage('');
      setIsSending(false);
      toast.success("Message sent to the queue");
    }, 800);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      toast.info(`Template "${template.name}" loaded`);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard");
  };

  const handleHistorySelect = (historicalMessage: string) => {
    setMessage(historicalMessage);
    setShowHistory(false);
    toast.info("Historical message loaded");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg border bg-background p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Producer</h2>
          <p className="text-sm text-muted-foreground">Send messages to the queue</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isSending ? "bg-yellow-500" : "bg-green-500"
          )}></div>
          <span className="text-xs">{isSending ? "Sending..." : "Ready"}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Message Content</span>
          
          <div className="ml-auto flex gap-2">
            {recentMessages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs h-8 flex items-center gap-1"
              >
                <History className="w-3 h-3" />
                History
              </Button>
            )}
            
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Load template" />
              </SelectTrigger>
              <SelectContent>
                {MESSAGE_TEMPLATES.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showHistory && recentMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 border rounded-md p-2 max-h-32 overflow-y-auto bg-muted/30"
          >
            <div className="text-xs font-medium mb-1 text-muted-foreground">Recent Messages</div>
            {recentMessages.slice(0, 5).map((msg, idx) => (
              <div 
                key={idx} 
                className="text-xs p-1 hover:bg-muted rounded cursor-pointer flex items-center justify-between"
                onClick={() => handleHistorySelect(msg)}
              >
                <div className="truncate max-w-[250px]">{msg}</div>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
          </motion.div>
        )}
        
        <div>
          <div className="relative">
            <Textarea
              placeholder="Enter your message content..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] font-mono text-sm resize-none pr-8"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={handleCopyToClipboard}
              disabled={!message.trim()}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex justify-between mt-2">
            <div className="text-xs text-muted-foreground">
              {message.length} characters
            </div>
            {message.startsWith('{') && (
              <div className="text-xs text-muted-foreground">
                JSON format detected
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={isSending || !message.trim()}
            className="relative overflow-hidden"
          >
            {isSending ? (
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              <>
                <Send className="mr-1 h-4 w-4" />
                Send Message
              </>
            )}
            
            {isSending && (
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProducerPanel;
