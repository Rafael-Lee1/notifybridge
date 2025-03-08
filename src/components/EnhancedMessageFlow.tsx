
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Server, ArrowRight, Package, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrokerConfigContext } from '@/pages/Index';

interface EnhancedMessageFlowProps {
  isActive: boolean;
  messageCount: number;
  className?: string;
}

const EnhancedMessageFlow: React.FC<EnhancedMessageFlowProps> = ({
  isActive,
  messageCount,
  className
}) => {
  const [messages, setMessages] = useState<number[]>([]);
  const brokerConfig = useContext(BrokerConfigContext);
  
  // Generate animated message dots
  useEffect(() => {
    if (!isActive) {
      setMessages([]);
      return;
    }
    
    // Generate new message animations based on queue depth
    const intervalTime = messageCount > 10 ? 300 : messageCount > 5 ? 600 : 1000;
    const maxSimultaneousMessages = messageCount > 15 ? 5 : messageCount > 8 ? 3 : 2;
    
    const interval = setInterval(() => {
      if (messages.length < maxSimultaneousMessages) {
        setMessages(prev => [...prev, Date.now()]);
      }
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [isActive, messageCount]);
  
  // Remove messages after animation completes
  const removeMessage = (id: number) => {
    setMessages(prev => prev.filter(m => m !== id));
  };
  
  // Get broker-specific icon
  const getBrokerIcon = () => {
    switch(brokerConfig.brokerType) {
      case 'rabbitmq':
        return <Package className="w-full h-full text-amber-500" />;
      case 'kafka':
        return <Zap className="w-full h-full text-blue-500" />;
      case 'activemq':
        return <Server className="w-full h-full text-green-500" />;
      default:
        return <Database className="w-full h-full text-purple-500" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col items-center justify-center h-full relative",
        className
      )}
    >
      {/* Producer */}
      <motion.div
        className="rounded-lg border bg-background shadow-sm p-2 w-24 h-24 flex flex-col items-center justify-center"
        animate={{ y: isActive ? [0, -5, 0] : 0 }}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatType: "reverse", repeatDelay: 1.5 }}
      >
        <HardDrive className="w-8 h-8 text-primary mb-2" />
        <span className="text-xs font-medium">Producer</span>
      </motion.div>
      
      {/* Flow path */}
      <div className="flex flex-col items-center my-1 relative w-full">
        <div className="h-16 border-l-2 border-dashed border-muted-foreground/40 relative">
          <AnimatePresence>
            {messages.map(id => (
              <motion.div
                key={id}
                className="absolute w-3 h-3 rounded-full bg-primary shadow-glow"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 64, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                onAnimationComplete={() => removeMessage(id)}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Message count badge */}
        {messageCount > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-7 -right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full"
          >
            {messageCount}
          </motion.div>
        )}
      </div>
      
      {/* Broker */}
      <motion.div
        className={cn(
          "rounded-lg border shadow-md p-3 w-32 h-32 flex flex-col items-center justify-center mb-4 relative",
          isActive ? "bg-background" : "bg-muted"
        )}
        animate={{ 
          scale: isActive ? [1, 1.03, 1] : 1,
          boxShadow: isActive ? "0 0 15px rgba(0, 0, 0, 0.1)" : "none"
        }}
        transition={{ duration: 1, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
      >
        <div className="w-12 h-12 mb-2">
          {getBrokerIcon()}
        </div>
        <span className="text-xs font-medium capitalize">{brokerConfig.brokerType}</span>
        <span className="text-[0.65rem] text-muted-foreground capitalize mt-1">
          {brokerConfig.exchangeType} · {brokerConfig.persistence}
        </span>
        
        {/* Animated pulse when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg border border-primary"
            animate={{ 
              opacity: [0, 0.2, 0],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </motion.div>
      
      {/* Flow path to consumer */}
      <div className="flex flex-col items-center my-1 relative w-full">
        <div className="h-16 border-l-2 border-dashed border-muted-foreground/40 relative">
          <AnimatePresence>
            {messages.map(id => (
              <motion.div
                key={`out-${id}`}
                className="absolute w-3 h-3 rounded-full bg-green-500 shadow-glow"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 64, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Consumer */}
      <motion.div
        className="rounded-lg border bg-background shadow-sm p-2 w-24 h-24 flex flex-col items-center justify-center"
        animate={{ 
          y: isActive && messageCount > 0 ? [0, 5, 0] : 0,
          backgroundColor: isActive ? "#ffffff" : "#f8f9fa"
        }}
        transition={{ duration: 0.5, repeat: (isActive && messageCount > 0) ? Infinity : 0, repeatType: "reverse", repeatDelay: 1.5 }}
      >
        <Server className="w-8 h-8 text-green-500 mb-2" />
        <span className="text-xs font-medium">Consumer</span>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedMessageFlow;
