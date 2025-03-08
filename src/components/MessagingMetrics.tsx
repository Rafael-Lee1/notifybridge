
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart2, Activity, Clock, MessageSquare, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MetricsData {
  timestamp: string;
  producerCount: number;
  consumerCount: number;
  queueDepth: number;
}

interface MessagingMetricsProps {
  producerMessages: any[];
  consumerMessages: any[];
  queuedMessages: string[];
  className?: string;
}

const MessagingMetrics: React.FC<MessagingMetricsProps> = ({
  producerMessages,
  consumerMessages,
  queuedMessages,
  className
}) => {
  const [chartData, setChartData] = useState<MetricsData[]>([]);
  const [viewPeriod, setViewPeriod] = useState<'1h' | '24h' | '7d'>('1h');
  
  // Generate time-based metrics data
  useEffect(() => {
    const generateData = () => {
      // For this demo, we'll generate synthetic historical data plus current data
      const now = new Date();
      const data: MetricsData[] = [];
      
      // Number of data points based on view period
      const points = viewPeriod === '1h' ? 12 : viewPeriod === '24h' ? 24 : 28;
      
      // Current stats
      const currentProducerCount = producerMessages.length;
      const currentConsumerCount = consumerMessages.length;
      const currentQueueDepth = queuedMessages.length;
      
      // Generate data with random variations around the current values
      for (let i = points; i >= 0; i--) {
        const timePoint = new Date(now.getTime() - (i * (viewPeriod === '1h' ? 5 * 60000 : viewPeriod === '24h' ? 60 * 60000 : 6 * 60 * 60000)));
        
        // Create variations based on current stats
        const variation = Math.random() * 0.4 - 0.2; // -20% to +20% variation
        const historyOffset = i / points; // Older data has more offset
        
        const pCount = Math.max(0, Math.round(currentProducerCount * (0.6 + historyOffset * 0.4) * (1 + variation)));
        const cCount = Math.max(0, Math.round(currentConsumerCount * (0.5 + historyOffset * 0.5) * (1 + variation)));
        const qDepth = Math.max(0, Math.round(currentQueueDepth * historyOffset * (1 + variation * 2)));
        
        data.push({
          timestamp: timePoint.toISOString(),
          producerCount: pCount,
          consumerCount: cCount,
          queueDepth: qDepth
        });
      }
      
      setChartData(data);
    };
    
    generateData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(generateData, 30000);
    return () => clearInterval(intervalId);
  }, [viewPeriod, producerMessages.length, consumerMessages.length, queuedMessages.length]);
  
  // Format timestamp for display based on view period
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (viewPeriod === '1h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (viewPeriod === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
  };
  
  const getMessageRates = () => {
    // Calculate message rates based on time periods
    const now = new Date().getTime();
    const oneMinuteAgo = now - 60000;
    const fiveMinutesAgo = now - 300000;
    
    const producerLastMinute = producerMessages.filter(m => new Date(m.timestamp).getTime() > oneMinuteAgo).length;
    const producerLastFiveMinutes = producerMessages.filter(m => new Date(m.timestamp).getTime() > fiveMinutesAgo).length / 5;
    
    const consumerLastMinute = consumerMessages.filter(m => new Date(m.timestamp).getTime() > oneMinuteAgo).length;
    const consumerLastFiveMinutes = consumerMessages.filter(m => new Date(m.timestamp).getTime() > fiveMinutesAgo).length / 5;
    
    return {
      producerPerMinute: producerLastMinute,
      producerAvgPerMinute: Math.round(producerLastFiveMinutes * 10) / 10,
      consumerPerMinute: consumerLastMinute,
      consumerAvgPerMinute: Math.round(consumerLastFiveMinutes * 10) / 10
    };
  };
  
  const rates = getMessageRates();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg border bg-background p-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Messaging Metrics</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              const currentViewPeriod = viewPeriod;
              setViewPeriod('1h');
              if (currentViewPeriod === '1h') {
                // Force refresh if already on 1h view
                setViewPeriod('24h');
                setTimeout(() => setViewPeriod('1h'), 10);
              }
            }}
          >
            <RefreshCcw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Produced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{producerMessages.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              {rates.producerPerMinute}/min (avg: {rates.producerAvgPerMinute}/min)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consumerMessages.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              {rates.consumerPerMinute}/min (avg: {rates.consumerAvgPerMinute}/min)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Queue Depth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queuedMessages.length}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {queuedMessages.length > 0 ? "Messages pending consumption" : "Queue empty"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="throughput" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="throughput">Throughput</TabsTrigger>
          <TabsTrigger value="queue">Queue Depth</TabsTrigger>
          <TabsTrigger value="comparison">Producer vs Consumer</TabsTrigger>
        </TabsList>
        
        <div className="mb-2 flex justify-end">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewPeriod === '1h' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs rounded-none"
              onClick={() => setViewPeriod('1h')}
            >
              1h
            </Button>
            <Button
              variant={viewPeriod === '24h' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs rounded-none"
              onClick={() => setViewPeriod('24h')}
            >
              24h
            </Button>
            <Button
              variant={viewPeriod === '7d' ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs rounded-none"
              onClick={() => setViewPeriod('7d')}
            >
              7d
            </Button>
          </div>
        </div>
        
        <TabsContent value="throughput" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                stroke="#888888"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                formatter={(value) => [`${value} messages`, '']}
                labelFormatter={(label) => `Time: ${new Date(label).toLocaleTimeString()}`}
              />
              <Line type="monotone" dataKey="producerCount" stroke="#2563eb" name="Produced" />
              <Line type="monotone" dataKey="consumerCount" stroke="#16a34a" name="Consumed" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="queue" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                stroke="#888888"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                formatter={(value) => [`${value} messages`, '']}
                labelFormatter={(label) => `Time: ${new Date(label).toLocaleTimeString()}`}
              />
              <Line type="monotone" dataKey="queueDepth" stroke="#d97706" strokeWidth={2} name="Queue Depth" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="comparison" className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                stroke="#888888"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                formatter={(value) => [`${value} messages`, '']}
                labelFormatter={(label) => `Time: ${new Date(label).toLocaleTimeString()}`}
              />
              <Bar dataKey="producerCount" fill="#2563eb" name="Produced" />
              <Bar dataKey="consumerCount" fill="#16a34a" name="Consumed" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MessagingMetrics;
