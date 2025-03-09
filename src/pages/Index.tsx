
import React, { useState, useEffect, useCallback, createContext } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import { Message } from '@/components/MessageList';
import ConfigPanel, { BrokerConfig } from '@/components/ConfigPanel';
import MessagingMetrics from '@/components/MessagingMetrics';
import { useAuth } from '@/context/AuthContext';

// Maximum number of messages to store in history
const MAX_MESSAGE_HISTORY = 100;

// Create context for broker configuration
export const BrokerConfigContext = createContext<BrokerConfig>({
  brokerType: 'rabbitmq',
  persistence: 'memory',
  exchangeType: 'direct',
  compression: false,
  retentionHours: 24
});

const Index = () => {
  const { user } = useAuth();
  
  // Load messages from localStorage on initial render
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('messageHistory');
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (e) {
      console.error('Failed to load message history:', e);
      return [];
    }
  });
  
  const [queuedMessages, setQueuedMessages] = useState<string[]>([]);
  const [consumerActive, setConsumerActive] = useState(true);
  const [processingDelay, setProcessingDelay] = useState(2000);
  const [sentMessageHistory, setSentMessageHistory] = useState<string[]>(() => {
    try {
      const savedHistory = localStorage.getItem('sentMessageHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error('Failed to load sent message history:', e);
      return [];
    }
  });
  
  // Show/hide metrics panel
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Load broker config from localStorage
  const [brokerConfig, setBrokerConfig] = useState<BrokerConfig>(() => {
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
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    const recentMessages = messages.slice(0, MAX_MESSAGE_HISTORY);
    localStorage.setItem('messageHistory', JSON.stringify(recentMessages));
  }, [messages]);
  
  // Save sent message history to localStorage
  useEffect(() => {
    localStorage.setItem('sentMessageHistory', JSON.stringify(sentMessageHistory.slice(0, 10)));
  }, [sentMessageHistory]);
  
  // Process queued messages when consumer is active
  useEffect(() => {
    if (!consumerActive || queuedMessages.length === 0) return;

    const timer = setTimeout(() => {
      const [nextMessage, ...remainingMessages] = queuedMessages;
      
      setQueuedMessages(remainingMessages);
      
      const newMessage: Message = {
        id: uuidv4(),
        content: nextMessage,
        timestamp: new Date().toISOString(),
        type: 'consumer',
        status: 'consumed'
      };
      
      setMessages(prev => [newMessage, ...prev]);
      toast.success("Message received", {
        description: nextMessage.length > 30 ? nextMessage.substring(0, 30) + '...' : nextMessage,
      });
      
    }, processingDelay);
    
    return () => clearTimeout(timer);
  }, [queuedMessages, consumerActive, processingDelay]);

  // Handle sending a message from the producer
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      type: 'producer',
      status: 'delivered'
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setQueuedMessages(prev => [...prev, content]);
    
    // Update sent message history without duplicates
    setSentMessageHistory(prev => {
      if (!prev.includes(content)) {
        return [content, ...prev].slice(0, 10);
      }
      return prev;
    });
    
    toast.success("Message sent", {
      description: content.length > 30 ? content.substring(0, 30) + '...' : content,
    });
  };
  
  // Clear message history
  const handleClearMessages = useCallback((type?: 'producer' | 'consumer') => {
    if (!type) {
      setMessages([]);
      toast.info("All message history cleared");
      return;
    }
    
    setMessages(prev => prev.filter(message => message.type !== type));
    if (type === 'producer') {
      setSentMessageHistory([]);
    }
    toast.info(`${type === 'producer' ? 'Sent' : 'Received'} message history cleared`);
  }, []);

  return (
    <BrokerConfigContext.Provider value={brokerConfig}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 container max-w-7xl mx-auto px-4 py-6"
        >
          <div className="mb-6">
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
          
          {showMetrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <MessagingMetrics 
                producerMessages={messages.filter(msg => msg.type === 'producer')}
                consumerMessages={messages.filter(msg => msg.type === 'consumer')}
                queuedMessages={queuedMessages}
              />
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <ConfigPanel />
                </div>
              </div>
            </motion.div>
          )}
        </motion.main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="py-4 border-t bg-white"
        >
          <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Interactive Messaging System Showcase
            </p>
            <div className="flex items-center gap-4">
              <button 
                className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                onClick={() => setShowMetrics(!showMetrics)}
              >
                {showMetrics ? 'Hide' : 'Show'} Message Analytics
              </button>
              <div className="px-2 border-r h-4"></div>
              <div className={`w-2 h-2 rounded-full ${consumerActive ? "bg-green-500" : "bg-amber-500"}`}></div>
              <span className="text-sm">{consumerActive ? "All Systems Operational" : "Consumer Inactive"}</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </BrokerConfigContext.Provider>
  );
};

export default Index;
