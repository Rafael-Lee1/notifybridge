
import React, { useState, useEffect, useCallback, createContext } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import Header from '@/components/Header';
import ProducerPanel from '@/components/ProducerPanel';
import ConsumerPanel from '@/components/ConsumerPanel';
import EnhancedMessageFlow from '@/components/EnhancedMessageFlow';
import AdvancedMessageFlow from '@/components/AdvancedMessageFlow';
import MessageList, { Message } from '@/components/MessageList';
import ConfigPanel, { BrokerConfig } from '@/components/ConfigPanel';
import MessagingMetrics from '@/components/MessagingMetrics';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [showMetrics, setShowMetrics] = useState(true);
  // Toggle between simple and advanced flow
  const [flowVisualization, setFlowVisualization] = useState<'simple' | 'advanced'>('simple');
  
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
  
  // Update broker config when changed
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedConfig = localStorage.getItem('brokerConfig');
        if (savedConfig) {
          setBrokerConfig(JSON.parse(savedConfig));
        }
      } catch (e) {
        console.error('Failed to load updated broker config:', e);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      toast.success("Message processed by consumer");
      
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

  // Process all queued messages at once
  const handleBatchProcess = useCallback(() => {
    if (queuedMessages.length === 0) return;
    
    toast.info(`Processing all ${queuedMessages.length} queued messages...`);
    
    const newMessages = queuedMessages.map(content => ({
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      type: 'consumer' as const,
      status: 'consumed' as const
    }));
    
    setMessages(prev => [...newMessages, ...prev]);
    setQueuedMessages([]);
    toast.success(`Successfully processed ${newMessages.length} messages`);
  }, [queuedMessages]);

  // Filter messages by type
  const producerMessages = messages.filter(msg => msg.type === 'producer');
  const consumerMessages = messages.filter(msg => msg.type === 'consumer');
  
  // Welcome message for first-time login
  useEffect(() => {
    if (user) {
      toast.success(`Welcome to the Messaging System, ${user.username}!`, {
        description: "You're now logged in and can access all features.",
        duration: 5000,
      });
    }
  }, [user]);

  return (
    <BrokerConfigContext.Provider value={brokerConfig}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 container max-w-7xl mx-auto px-4 py-6 overflow-x-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Messaging System Showcase</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              A visual demonstration of producer/consumer communication using a message broker
            </p>
            {user && (
              <p className="text-sm text-primary mt-2">
                Logged in as {user.username} ({user.role})
              </p>
            )}
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
            <div className="md:col-span-1 lg:col-span-5">
              <ProducerPanel 
                onSendMessage={handleSendMessage} 
                recentMessages={sentMessageHistory}
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center mt-4 md:mt-0">
              {flowVisualization === 'simple' && (
                <Tabs 
                  value={flowVisualization} 
                  onValueChange={(v) => setFlowVisualization(v as 'simple' | 'advanced')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="simple" className="w-full">
                    <EnhancedMessageFlow 
                      isActive={queuedMessages.length > 0 || consumerActive} 
                      messageCount={queuedMessages.length}
                    />
                  </TabsContent>
                </Tabs>
              )}
              
              {flowVisualization === 'simple' || (
                <Tabs 
                  value={flowVisualization} 
                  onValueChange={(v) => setFlowVisualization(v as 'simple' | 'advanced')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
            
            <div className="md:col-span-1 lg:col-span-5">
              <ConsumerPanel
                isActive={consumerActive}
                onToggleActive={setConsumerActive}
                messageCount={queuedMessages.length}
                processingDelay={processingDelay}
                onProcessingDelayChange={setProcessingDelay}
                onBatchProcess={handleBatchProcess}
              />
            </div>
          </div>
          
          {/* Advanced mode visualization rendered below when selected */}
          {flowVisualization === 'advanced' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 border rounded-lg bg-background/50"
            >
              <h3 className="text-lg font-medium mb-2">Advanced Message Flow Visualization</h3>
              <AdvancedMessageFlow />
            </motion.div>
          )}
          
          {showMetrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-x-auto"
            >
              <MessagingMetrics 
                producerMessages={producerMessages}
                consumerMessages={consumerMessages}
                queuedMessages={queuedMessages}
              />
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="md:col-span-1 lg:col-span-5 h-80">
              <MessageList 
                messages={messages} 
                type="producer" 
                onClearMessages={() => handleClearMessages('producer')}
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-2 mt-4 md:mt-0">
              <ConfigPanel />
            </div>
            
            <div className="md:col-span-1 lg:col-span-5 h-80">
              <MessageList 
                messages={messages} 
                type="consumer" 
                onClearMessages={() => handleClearMessages('consumer')}
              />
            </div>
          </div>
        </motion.main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="py-4 md:py-6 border-t"
        >
          <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Interactive Messaging System Showcase
            </p>
            <div className="flex items-center gap-2">
              <button 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMetrics(!showMetrics)}
              >
                {showMetrics ? 'Hide' : 'Show'} Metrics
              </button>
              <div className="px-2 border-r h-4 hidden md:block"></div>
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
