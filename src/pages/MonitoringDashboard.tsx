
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart, 
  Clock, 
  RefreshCcw, 
  AlarmClock,
  Cpu,
  ArrowDownUp,
  Server
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Header from '@/components/Header';
import MessagingMetrics from '@/components/MessagingMetrics';

const MonitoringDashboard: React.FC = () => {
  // Mock data for demo purposes
  const [producerMessages, setProducerMessages] = useState<any[]>([]);
  const [consumerMessages, setConsumerMessages] = useState<any[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<string[]>([]);
  const [systemStats, setSystemStats] = useState({
    cpu: Math.floor(Math.random() * 30) + 10,
    memory: Math.floor(Math.random() * 40) + 20,
    disk: Math.floor(Math.random() * 20) + 5,
    network: Math.floor(Math.random() * 50) + 30,
    uptime: "5d 12h 34m",
    activeConnections: Math.floor(Math.random() * 20) + 5
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate some fake messages for the demo
  useEffect(() => {
    const generateMessages = () => {
      const now = new Date();
      const messagesCount = Math.floor(Math.random() * 5) + 3; // 3-7 messages
      
      const newProducerMessages = [];
      const newConsumerMessages = [];
      
      for (let i = 0; i < messagesCount; i++) {
        const timestamp = new Date(now.getTime() - (i * 60000)); // Every minute
        
        // Producer message
        newProducerMessages.push({
          id: `p-${Date.now()}-${i}`,
          content: `Message content ${i}`,
          timestamp: timestamp.toISOString(),
          topic: ['notifications', 'orders', 'users'][Math.floor(Math.random() * 3)]
        });
        
        // Only consume some messages (fewer than produced for realistic backlog)
        if (Math.random() > 0.3) {
          newConsumerMessages.push({
            id: `c-${Date.now()}-${i}`,
            content: `Message content ${i}`,
            timestamp: new Date(timestamp.getTime() + 10000).toISOString(), // 10 seconds later
            topic: ['notifications', 'orders', 'users'][Math.floor(Math.random() * 3)]
          });
        }
      }
      
      setProducerMessages(prev => [...newProducerMessages, ...prev].slice(0, 100));
      setConsumerMessages(prev => [...newConsumerMessages, ...prev].slice(0, 100));
      
      // Generate queued messages (difference between produced and consumed)
      const queueSize = Math.max(0, newProducerMessages.length - newConsumerMessages.length + Math.floor(Math.random() * 3));
      const newQueuedMessages = Array.from({ length: queueSize }, (_, i) => `queued-message-${Date.now()}-${i}`);
      setQueuedMessages(prev => [...newQueuedMessages, ...prev].slice(0, 20));
      
      // Update system stats
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 40) + 20,
        disk: Math.floor(Math.random() * 20) + 5,
        network: Math.floor(Math.random() * 50) + 30,
        uptime: "5d 12h 34m",
        activeConnections: Math.floor(Math.random() * 20) + 5
      });
      
      setLastUpdated(new Date());
    };
    
    // Generate initial data
    generateMessages();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      if (autoRefresh) {
        generateMessages();
      }
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  const handleRefresh = () => {
    // Force refresh data
    const now = new Date();
    const messagesCount = Math.floor(Math.random() * 5) + 3;
    
    const newProducerMessages = [];
    const newConsumerMessages = [];
    
    for (let i = 0; i < messagesCount; i++) {
      const timestamp = new Date(now.getTime() - (i * 60000));
      
      newProducerMessages.push({
        id: `p-${Date.now()}-${i}`,
        content: `Message content ${i}`,
        timestamp: timestamp.toISOString(),
        topic: ['notifications', 'orders', 'users'][Math.floor(Math.random() * 3)]
      });
      
      if (Math.random() > 0.3) {
        newConsumerMessages.push({
          id: `c-${Date.now()}-${i}`,
          content: `Message content ${i}`,
          timestamp: new Date(timestamp.getTime() + 10000).toISOString(),
          topic: ['notifications', 'orders', 'users'][Math.floor(Math.random() * 3)]
        });
      }
    }
    
    setProducerMessages(prev => [...newProducerMessages, ...prev].slice(0, 100));
    setConsumerMessages(prev => [...newConsumerMessages, ...prev].slice(0, 100));
    
    const queueSize = Math.max(0, newProducerMessages.length - newConsumerMessages.length + Math.floor(Math.random() * 3));
    const newQueuedMessages = Array.from({ length: queueSize }, (_, i) => `queued-message-${Date.now()}-${i}`);
    setQueuedMessages(prev => [...newQueuedMessages, ...prev].slice(0, 20));
    
    setSystemStats({
      cpu: Math.floor(Math.random() * 30) + 10,
      memory: Math.floor(Math.random() * 40) + 20,
      disk: Math.floor(Math.random() * 20) + 5,
      network: Math.floor(Math.random() * 50) + 30,
      uptime: "5d 12h 34m",
      activeConnections: Math.floor(Math.random() * 20) + 5
    });
    
    setLastUpdated(new Date());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-7xl py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time metrics and insights for your messaging system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="flex items-center gap-1"
              >
                <AlarmClock className="h-3.5 w-3.5" />
                {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{systemStats.cpu}%</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Server className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{systemStats.memory}%</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Network I/O</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ArrowDownUp className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{systemStats.network} KB/s</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{systemStats.activeConnections}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <MessagingMetrics 
            producerMessages={producerMessages} 
            consumerMessages={consumerMessages} 
            queuedMessages={queuedMessages}
            className="mb-6"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Overall system health and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium">{systemStats.uptime}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Disk Usage</span>
                    <span className="font-medium">{systemStats.disk}%</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Broker Version</span>
                    <span className="font-medium">2.5.1</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Active Topics</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Configured Queues</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Message Rates</CardTitle>
                <CardDescription>Current throughput statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Published (avg/min)</span>
                    <span className="font-medium">{Math.floor(Math.random() * 50) + 20}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Consumed (avg/min)</span>
                    <span className="font-medium">{Math.floor(Math.random() * 45) + 18}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Mean Latency</span>
                    <span className="font-medium">{Math.floor(Math.random() * 150) + 50} ms</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Max Queue Size</span>
                    <span className="font-medium">{Math.floor(Math.random() * 100) + 1000}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span className="font-medium">{(Math.random() * 0.5).toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MonitoringDashboard;
