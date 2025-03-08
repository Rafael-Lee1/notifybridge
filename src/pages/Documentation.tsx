
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  Server, 
  MessageSquare, 
  Cpu, 
  Database, 
  RefreshCw, 
  Settings, 
  Layers,
  Search
} from 'lucide-react';
import Header from '@/components/Header';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const documentation = {
    'getting-started': [
      {
        title: 'Introduction',
        content: `
          <p>Welcome to our Messaging System documentation. This system provides a robust platform for message handling and monitoring with support for various message brokers.</p>
          <p>Our system offers:</p>
          <ul>
            <li>Message production and consumption</li>
            <li>Real-time monitoring</li>
            <li>Message archiving</li>
            <li>Configuration management</li>
            <li>Topics and queues management</li>
          </ul>
        `
      },
      {
        title: 'Quick Start Guide',
        content: `
          <p>To get started with our messaging system:</p>
          <ol>
            <li>Create a user account for access</li>
            <li>Configure your message broker settings</li>
            <li>Set up topics and queues</li>
            <li>Start producing and consuming messages</li>
            <li>Monitor system performance through the dashboard</li>
          </ol>
          <p>For a complete walkthrough, visit the specific sections in our documentation.</p>
        `
      },
      {
        title: 'System Requirements',
        content: `
          <p>The messaging system requires:</p>
          <ul>
            <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
            <li>Network access to your message broker</li>
            <li>Proper permissions for broker access</li>
          </ul>
          <p>For optimal performance, we recommend a broker with at least 2GB RAM.</p>
        `
      }
    ],
    'message-brokers': [
      {
        title: 'Supported Brokers',
        content: `
          <p>Our system supports the following message brokers:</p>
          <ul>
            <li><strong>RabbitMQ</strong> - AMQP-based messaging with strong reliability</li>
            <li><strong>Apache Kafka</strong> - High-throughput distributed messaging platform</li>
            <li><strong>ActiveMQ</strong> - Flexible, multi-protocol messaging</li>
            <li><strong>Redis Pub/Sub</strong> - Lightweight messaging using Redis</li>
          </ul>
        `
      },
      {
        title: 'Broker Configuration',
        content: `
          <p>Each broker requires specific configuration parameters:</p>
          <ul>
            <li>Connection details (host, port)</li>
            <li>Authentication credentials</li>
            <li>Persistence settings</li>
            <li>Exchange/topic configurations</li>
          </ul>
          <p>Refer to the Settings page for detailed configuration options.</p>
        `
      },
      {
        title: 'Performance Considerations',
        content: `
          <p>When selecting a broker, consider:</p>
          <ul>
            <li>Message throughput requirements</li>
            <li>Need for persistence vs performance</li>
            <li>Message ordering guarantees</li>
            <li>Clustering and high availability requirements</li>
          </ul>
          <p>Our monitoring dashboard can help evaluate broker performance.</p>
        `
      }
    ],
    'features': [
      {
        title: 'Message Production',
        content: `
          <p>The message producer allows you to:</p>
          <ul>
            <li>Create and send messages to specific topics</li>
            <li>Set message properties and headers</li>
            <li>Define message priority</li>
            <li>Track delivery status</li>
          </ul>
          <p>The producer interface supports both one-time and batch message submissions.</p>
        `
      },
      {
        title: 'Message Consumption',
        content: `
          <p>The message consumer provides:</p>
          <ul>
            <li>Real-time message reception</li>
            <li>Message acknowledgment controls</li>
            <li>Filtering capabilities</li>
            <li>Error handling and dead-letter support</li>
          </ul>
          <p>Consumers can be paused, resumed, and configured for different processing rates.</p>
        `
      },
      {
        title: 'Monitoring Dashboard',
        content: `
          <p>Our monitoring dashboard offers:</p>
          <ul>
            <li>Real-time message throughput metrics</li>
            <li>Queue depth visualization</li>
            <li>Consumer/producer activity tracking</li>
            <li>System resource utilization</li>
            <li>Historical performance data</li>
          </ul>
          <p>Customizable views allow focusing on specific aspects of system performance.</p>
        `
      }
    ],
    'admin-guide': [
      {
        title: 'User Management',
        content: `
          <p>As an administrator, you can:</p>
          <ul>
            <li>Create and manage user accounts</li>
            <li>Assign roles and permissions</li>
            <li>Monitor user activity</li>
            <li>Reset passwords</li>
          </ul>
          <p>Different roles provide varying levels of system access and control.</p>
        `
      },
      {
        title: 'System Configuration',
        content: `
          <p>System-wide configuration options include:</p>
          <ul>
            <li>Default broker settings</li>
            <li>Security policies</li>
            <li>Data retention rules</li>
            <li>Monitoring thresholds</li>
          </ul>
          <p>All changes are logged for accountability and troubleshooting.</p>
        `
      },
      {
        title: 'Backup and Recovery',
        content: `
          <p>To ensure system reliability:</p>
          <ul>
            <li>Configure regular configuration backups</li>
            <li>Set up message archive retention policies</li>
            <li>Implement broker redundancy where possible</li>
            <li>Test recovery procedures periodically</li>
          </ul>
          <p>The system provides export tools for configuration and archived messages.</p>
        `
      }
    ]
  };
  
  // Filter documentation based on search query
  const filterDocumentation = () => {
    if (!searchQuery.trim()) return documentation;
    
    const filtered: any = {};
    
    Object.entries(documentation).forEach(([category, items]) => {
      const matchingItems = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingItems.length > 0) {
        filtered[category] = matchingItems;
      }
    });
    
    return filtered;
  };
  
  const filteredDocs = filterDocumentation();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
          <p className="text-muted-foreground">
            Learn how to use and configure the messaging system
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documentation..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSearchQuery('')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  All Documentation
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSearchQuery('broker')}
                >
                  <Server className="mr-2 h-4 w-4" />
                  Message Brokers
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSearchQuery('monitoring')}
                >
                  <Cpu className="mr-2 h-4 w-4" />
                  Monitoring
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSearchQuery('topic')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Topics & Queues
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSearchQuery('configuration')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuration
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSearchQuery('code')}
                >
                  <Code className="mr-2 h-4 w-4" />
                  API Reference
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="getting-started">
              <TabsList className="mb-4">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="message-brokers">Message Brokers</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="admin-guide">Admin Guide</TabsTrigger>
              </TabsList>
              
              {Object.entries(filteredDocs).map(([category, items]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-medium">
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div 
                            className="prose dark:prose-invert max-w-none" 
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {items.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No documentation found for this category.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
              
              {Object.keys(filteredDocs).length === 0 && (
                <div className="text-center py-12">
                  <Database className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">No results found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any documentation matching "{searchQuery}"
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset search
                  </Button>
                </div>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
