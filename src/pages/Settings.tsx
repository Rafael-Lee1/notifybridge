
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { BrokerConfig } from "@/components/ConfigPanel";

const Settings = () => {
  const { toast: uiToast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Load saved config from localStorage
  const [settings, setSettings] = useState<BrokerConfig & {
    maxConnections: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    queuePrefetch: number;
    enableTLS: boolean;
    heartbeatInterval: number;
  }>(() => {
    try {
      const savedConfig = localStorage.getItem('brokerConfig');
      const basicConfig = savedConfig ? JSON.parse(savedConfig) : {
        brokerType: 'rabbitmq',
        persistence: 'memory',
        exchangeType: 'direct',
        compression: false,
        retentionHours: 24
      };
      
      // Add advanced settings
      return {
        ...basicConfig,
        maxConnections: 100,
        logLevel: 'info',
        queuePrefetch: 10,
        enableTLS: false,
        heartbeatInterval: 60
      };
    } catch (e) {
      console.error('Failed to load broker config:', e);
      return {
        brokerType: 'rabbitmq',
        persistence: 'memory',
        exchangeType: 'direct',
        compression: false,
        retentionHours: 24,
        maxConnections: 100,
        logLevel: 'info',
        queuePrefetch: 10,
        enableTLS: false,
        heartbeatInterval: 60
      };
    }
  });
  
  const handleSettingChange = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Save basic settings to localStorage for other components
    const basicSettings: BrokerConfig = {
      brokerType: settings.brokerType,
      persistence: settings.persistence,
      exchangeType: settings.exchangeType,
      compression: settings.compression,
      retentionHours: settings.retentionHours
    };
    
    localStorage.setItem('brokerConfig', JSON.stringify(basicSettings));
    
    // Simulate saving advanced settings
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
      uiToast({
        title: "Settings saved",
        description: "All broker settings have been updated"
      });
    }, 1000);
  };
  
  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings({
        brokerType: 'rabbitmq',
        persistence: 'memory',
        exchangeType: 'direct',
        compression: false,
        retentionHours: 24,
        maxConnections: 100,
        logLevel: 'info',
        queuePrefetch: 10,
        enableTLS: false,
        heartbeatInterval: 60
      });
      
      toast.info("Settings reset to defaults");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-6xl py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Configure advanced broker settings for optimal performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                disabled={saving}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full mb-4 grid grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Configuration</CardTitle>
                  <CardDescription>
                    Configure the core broker settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="broker-type">Broker Type</Label>
                      <Select 
                        value={settings.brokerType} 
                        onValueChange={(value: 'rabbitmq' | 'kafka' | 'activemq') => handleSettingChange('brokerType', value)}
                      >
                        <SelectTrigger id="broker-type">
                          <SelectValue placeholder="Select broker type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rabbitmq">RabbitMQ</SelectItem>
                          <SelectItem value="kafka">Kafka</SelectItem>
                          <SelectItem value="activemq">ActiveMQ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="persistence">Persistence</Label>
                      <Select 
                        value={settings.persistence} 
                        onValueChange={(value: 'memory' | 'disk') => handleSettingChange('persistence', value)}
                      >
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
                      <Label htmlFor="exchange-type">Exchange Type</Label>
                      <Select 
                        value={settings.exchangeType} 
                        onValueChange={(value: 'direct' | 'topic' | 'fanout') => handleSettingChange('exchangeType', value)}
                      >
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="retention">Message Retention (hours)</Label>
                      <Input
                        id="retention"
                        type="number"
                        min="1"
                        max="720"
                        value={settings.retentionHours}
                        onChange={(e) => handleSettingChange('retentionHours', parseInt(e.target.value) || 24)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compression"
                      checked={settings.compression}
                      onCheckedChange={(checked) => handleSettingChange('compression', checked)}
                    />
                    <Label htmlFor="compression">Enable Message Compression</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logging Settings</CardTitle>
                  <CardDescription>
                    Configure log levels and audit settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="log-level">Log Level</Label>
                    <Select 
                      value={settings.logLevel} 
                      onValueChange={(value: 'debug' | 'info' | 'warn' | 'error') => handleSettingChange('logLevel', value)}
                    >
                      <SelectTrigger id="log-level">
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Network Configuration</CardTitle>
                  <CardDescription>
                    Configure network and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-connections">Max Connections</Label>
                      <Input
                        id="max-connections"
                        type="number"
                        min="1"
                        max="1000"
                        value={settings.maxConnections}
                        onChange={(e) => handleSettingChange('maxConnections', parseInt(e.target.value) || 100)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="heartbeat">Heartbeat Interval (seconds)</Label>
                      <Input
                        id="heartbeat"
                        type="number"
                        min="5"
                        max="300"
                        value={settings.heartbeatInterval}
                        onChange={(e) => handleSettingChange('heartbeatInterval', parseInt(e.target.value) || 60)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-tls"
                      checked={settings.enableTLS}
                      onCheckedChange={(checked) => handleSettingChange('enableTLS', checked)}
                    />
                    <Label htmlFor="enable-tls">Enable TLS/SSL</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Settings</CardTitle>
                  <CardDescription>
                    Optimize broker performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prefetch">Queue Prefetch Count</Label>
                      <Input
                        id="prefetch"
                        type="number"
                        min="1"
                        max="1000"
                        value={settings.queuePrefetch}
                        onChange={(e) => handleSettingChange('queuePrefetch', parseInt(e.target.value) || 10)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Specifies how many messages to prefetch from the queue
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
