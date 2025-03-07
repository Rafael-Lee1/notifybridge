
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

interface ProducerPanelProps {
  onSendMessage: (message: string) => void;
  className?: string;
}

const ProducerPanel: React.FC<ProducerPanelProps> = ({ onSendMessage, className }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

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
        <div>
          <label htmlFor="messageContent" className="text-sm font-medium mb-1 block">
            Message Content
          </label>
          <Textarea
            id="messageContent"
            placeholder="Enter your message content..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>
        
        <div className="flex justify-end">
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
              "Send Message"
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
