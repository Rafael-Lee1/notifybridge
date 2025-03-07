import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import Header from '@/components/Header';
import ProducerPanel from '@/components/ProducerPanel';
import ConsumerPanel from '@/components/ConsumerPanel';
import MessageFlow from '@/components/MessageFlow';
import MessageList, { Message } from '@/components/MessageList';
import ConfigPanel from '@/components/ConfigPanel';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<string[]>([]);
  const [consumerActive, setConsumerActive] = useState(true);
  const [processingDelay, setProcessingDelay] = useState(2000);

  useEffect(() => {
    if (!consumerActive || queuedMessages.length === 0) return;

    const timer = setTimeout(() => {
      const [nextMessage, ...remainingMessages] = queuedMessages;
      
      setQueuedMessages(remainingMessages);
      
      const newMessage: Message = {
        id: uuidv4(),
        content: nextMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: 'consumer',
        status: 'consumed'
      };
      
      setMessages(prev => [newMessage, ...prev]);
      toast.success("Message processed by consumer");
      
    }, processingDelay);
    
    return () => clearTimeout(timer);
  }, [queuedMessages, consumerActive, processingDelay]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      timestamp: new Date().toLocaleTimeString(),
      type: 'producer',
      status: 'delivered'
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setQueuedMessages(prev => [...prev, content]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex-1 container max-w-7xl mx-auto px-4 py-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Messaging System Showcase</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A visual demonstration of producer/consumer communication using a message broker
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-5">
            <ProducerPanel onSendMessage={handleSendMessage} />
          </div>
          
          <div className="lg:col-span-2 flex items-center justify-center">
            <MessageFlow 
              isActive={queuedMessages.length > 0 || consumerActive} 
              messageCount={queuedMessages.length}
            />
          </div>
          
          <div className="lg:col-span-5">
            <ConsumerPanel
              isActive={consumerActive}
              onToggleActive={setConsumerActive}
              messageCount={queuedMessages.length}
              processingDelay={processingDelay}
              onProcessingDelayChange={setProcessingDelay}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-80">
            <MessageList messages={messages} type="producer" />
          </div>
          
          <div className="lg:col-span-2">
            <ConfigPanel />
          </div>
          
          <div className="lg:col-span-5 h-80">
            <MessageList messages={messages} type="consumer" />
          </div>
        </div>
      </motion.main>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="py-6 border-t"
      >
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Interactive Messaging System Showcase
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm">All Systems Operational</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
