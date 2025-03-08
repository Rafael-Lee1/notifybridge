
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Clock, HardDrive, Server, Laptop, Globe, GitBranch, ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrokerConfigContext } from './Index';

const BrokerInfo: React.FC = () => {
  const brokerConfig = useContext(BrokerConfigContext);
  
  const getBrokerDescription = () => {
    switch(brokerConfig.brokerType) {
      case 'rabbitmq':
        return {
          name: 'RabbitMQ',
          description: 'RabbitMQ is an open-source message broker software that implements the Advanced Message Queuing Protocol (AMQP).',
          strengthsPoints: [
            'Excellent for complex routing scenarios',
            'Built-in clustering and high availability',
            'Support for multiple messaging protocols',
            'Mature and well-tested in production'
          ],
          useCases: [
            'Microservices architecture',
            'Background job processing',
            'Distributed systems communication',
            'Work queues and task distribution'
          ],
          diagram: 'rabbitmq'
        };
      case 'kafka':
        return {
          name: 'Apache Kafka',
          description: 'Kafka is a distributed event streaming platform capable of handling trillions of events a day.',
          strengthsPoints: [
            'High-throughput, low-latency platform',
            'Durable message storage with configurable retention',
            'Excellent for stream processing',
            'Horizontal scalability with partitioning'
          ],
          useCases: [
            'Real-time analytics',
            'Log aggregation',
            'Event sourcing',
            'Stream processing pipelines'
          ],
          diagram: 'kafka'
        };
      case 'activemq':
        return {
          name: 'ActiveMQ',
          description: 'ActiveMQ is an open source message broker written in Java that provides a JMS client.',
          strengthsPoints: [
            'JMS 1.1 and 2.0 compliant',
            'Support for multiple protocols',
            'Enterprise integration patterns',
            'Client support for many languages'
          ],
          useCases: [
            'Enterprise application integration',
            'Java application messaging',
            'Cross-language messaging',
            'Legacy system integration'
          ],
          diagram: 'activemq'
        };
      default:
        return {
          name: 'Message Broker',
          description: 'A message broker is software that enables applications to communicate with each other.',
          strengthsPoints: [
            'Decoupling of services',
            'Load balancing',
            'Reliable message delivery',
            'Asynchronous communication'
          ],
          useCases: [
            'Microservices communication',
            'Distributed computing',
            'Event-driven architecture',
            'Task processing and distribution'
          ],
          diagram: 'default'
        };
    }
  };
  
  const brokerInfo = getBrokerDescription();
  
  const renderExchangeTypeInfo = () => {
    switch(brokerConfig.exchangeType) {
      case 'direct':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 text-blue-800 p-1 rounded">
                <ArrowRight className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-medium">Direct Exchange</h3>
            </div>
            <p className="text-muted-foreground">
              A direct exchange delivers messages to queues based on a message routing key. 
              The routing key is a message attribute added to the message header by the producer.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center items-center gap-8">
                  <div className="border rounded p-2 bg-blue-50">Producer</div>
                  <ArrowRight className="w-4 h-4" />
                  <div className="border rounded p-2 bg-amber-50">Exchange</div>
                </div>
                <div className="h-6 border-l-2 border-dashed border-muted-foreground"></div>
                <div className="flex justify-center items-center gap-8">
                  <div className="border rounded p-2 bg-green-50">Queue A</div>
                  <div className="border rounded p-2 bg-green-50">Queue B</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'fanout':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 text-purple-800 p-1 rounded">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-medium">Fanout Exchange</h3>
            </div>
            <p className="text-muted-foreground">
              A fanout exchange routes messages to all of the queues that are bound to it.
              The routing key is ignored for fanout exchanges.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center items-center gap-8">
                  <div className="border rounded p-2 bg-blue-50">Producer</div>
                  <ArrowRight className="w-4 h-4" />
                  <div className="border rounded p-2 bg-amber-50">Exchange</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-6 border-l-2 border-dashed border-muted-foreground"></div>
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center gap-4">
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div className="border rounded p-2 bg-green-50">Queue A</div>
                  <div className="border rounded p-2 bg-green-50">Queue B</div>
                  <div className="border rounded p-2 bg-green-50">Queue C</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'topic':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-800 p-1 rounded">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-medium">Topic Exchange</h3>
            </div>
            <p className="text-muted-foreground">
              Topic exchanges route messages to queues based on wildcard matches between the routing key and the queue binding pattern.
              Messages are routed to one or many queues based on a pattern match between a message routing key and the routing pattern specified in the binding.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center items-center gap-8">
                  <div className="border rounded p-2 bg-blue-50">Producer</div>
                  <ArrowRight className="w-4 h-4" />
                  <div className="border rounded p-2 bg-amber-50">Exchange</div>
                </div>
                <div className="grid grid-cols-3 gap-8 mt-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground">user.created.*</div>
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    <div className="border rounded p-2 bg-green-50">User Queue</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground">*.critical.*</div>
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    <div className="border rounded p-2 bg-green-50">Alerts Queue</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground">order.#</div>
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    <div className="border rounded p-2 bg-green-50">Orders Queue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-zinc-100 text-zinc-800 p-1 rounded">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-medium">Headers Exchange</h3>
            </div>
            <p className="text-muted-foreground">
              Headers exchanges use the message header attributes for routing instead of the routing key.
              A special argument called "x-match" specifies if all headers must match or just one.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Message Broker Information</h1>
        </div>
      </div>
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 container max-w-7xl mx-auto px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-semibold tracking-tight">{brokerInfo.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {brokerInfo.description}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Message Retention
              </CardTitle>
              <CardDescription>Current retention policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{brokerConfig.retentionHours} hours</div>
              <p className="text-sm text-muted-foreground mt-2">
                Messages will be stored for {brokerConfig.retentionHours} hours before being automatically purged from the system.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                Persistence
              </CardTitle>
              <CardDescription>Data storage method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{brokerConfig.persistence}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {brokerConfig.persistence === 'memory' 
                  ? 'Messages are stored in memory and will be lost if the broker restarts.' 
                  : 'Messages are persisted to disk and will survive broker restarts.'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                Compression
              </CardTitle>
              <CardDescription>Message compression status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{brokerConfig.compression ? 'Enabled' : 'Disabled'}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {brokerConfig.compression 
                  ? 'Messages are compressed to reduce storage and bandwidth usage.' 
                  : 'Messages are stored uncompressed, resulting in higher bandwidth usage but faster processing.'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="exchange" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exchange">Exchange Types</TabsTrigger>
            <TabsTrigger value="comparison">Broker Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exchange" className="mt-6 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Exchange Type: <span className="text-primary capitalize">{brokerConfig.exchangeType}</span></h2>
              {renderExchangeTypeInfo()}
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-0 border-b">
                <div className="p-4 font-semibold bg-muted">Feature</div>
                <div className="p-4 font-semibold text-center border-l">RabbitMQ</div>
                <div className="p-4 font-semibold text-center border-l">Kafka</div>
                <div className="p-4 font-semibold text-center border-l">ActiveMQ</div>
              </div>
              
              <div className="grid grid-cols-4 gap-0 border-b">
                <div className="p-4 bg-muted">Message Throughput</div>
                <div className="p-4 text-center border-l">Medium-High</div>
                <div className="p-4 text-center border-l font-medium">Very High</div>
                <div className="p-4 text-center border-l">Medium</div>
              </div>
              
              <div className="grid grid-cols-4 gap-0 border-b">
                <div className="p-4 bg-muted">Delivery Guarantee</div>
                <div className="p-4 text-center border-l font-medium">At-least-once, At-most-once, Exactly-once</div>
                <div className="p-4 text-center border-l">At-least-once</div>
                <div className="p-4 text-center border-l">At-least-once, At-most-once</div>
              </div>
              
              <div className="grid grid-cols-4 gap-0 border-b">
                <div className="p-4 bg-muted">Message Ordering</div>
                <div className="p-4 text-center border-l">Limited</div>
                <div className="p-4 text-center border-l font-medium">Per partition</div>
                <div className="p-4 text-center border-l">Limited</div>
              </div>
              
              <div className="grid grid-cols-4 gap-0 border-b">
                <div className="p-4 bg-muted">Routing Capabilities</div>
                <div className="p-4 text-center border-l font-medium">Extensive</div>
                <div className="p-4 text-center border-l">Basic</div>
                <div className="p-4 text-center border-l">Good</div>
              </div>
              
              <div className="grid grid-cols-4 gap-0">
                <div className="p-4 bg-muted">Best Use Case</div>
                <div className="p-4 text-center border-l">Complex routing, RPC</div>
                <div className="p-4 text-center border-l">High-volume streaming</div>
                <div className="p-4 text-center border-l">JMS messaging</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>Common scenarios for {brokerInfo.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {brokerInfo.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Strengths</CardTitle>
              <CardDescription>What makes {brokerInfo.name} stand out</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {brokerInfo.strengthsPoints.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-8">
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messaging Demo
            </Button>
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default BrokerInfo;
