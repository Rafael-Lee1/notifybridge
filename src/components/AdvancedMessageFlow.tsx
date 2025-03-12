
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, HardDrive, Database, Layers, BarChart2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageNode {
  id: string;
  type: 'producer' | 'broker' | 'topic' | 'consumer' | 'database';
  label: string;
  x: number;
  y: number;
  connections: string[];
  status?: 'active' | 'inactive' | 'warning' | 'error';
  messageCount?: number;
  icon?: React.ReactNode;
}

interface MessageLink {
  source: string;
  target: string;
  active: boolean;
  messageCount: number;
}

interface AnimatingMessage {
  id: string;
  sourceId: string;
  targetId: string;
  startTime: number;
  duration: number;
}

interface AdvancedMessageFlowProps {
  className?: string;
  autoGenerate?: boolean;
}

const AdvancedMessageFlow: React.FC<AdvancedMessageFlowProps> = ({ 
  className,
  autoGenerate = true
}) => {
  const [nodes, setNodes] = useState<MessageNode[]>([]);
  const [links, setLinks] = useState<MessageLink[]>([]);
  const [animatingMessages, setAnimatingMessages] = useState<AnimatingMessage[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize the flow diagram
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      
      // Create initial nodes with better spacing based on available width/height
      const initialNodes: MessageNode[] = [
        {
          id: 'producer1',
          type: 'producer',
          label: 'Producer 1',
          x: width * 0.15,
          y: height * 0.2,
          connections: ['broker1'],
          status: 'active',
          messageCount: 0,
          icon: <HardDrive className="w-5 h-5 text-blue-500" />
        },
        {
          id: 'producer2',
          type: 'producer',
          label: 'Producer 2',
          x: width * 0.15,
          y: height * 0.5,
          connections: ['broker1'],
          status: 'active',
          messageCount: 0,
          icon: <HardDrive className="w-5 h-5 text-indigo-500" />
        },
        {
          id: 'producer3',
          type: 'producer',
          label: 'Producer 3',
          x: width * 0.15,
          y: height * 0.8,
          connections: ['broker1'],
          status: 'inactive',
          messageCount: 0,
          icon: <HardDrive className="w-5 h-5 text-gray-500" />
        },
        {
          id: 'broker1',
          type: 'broker',
          label: 'RabbitMQ Broker',
          x: width * 0.4,
          y: height * 0.5,
          connections: ['topic1', 'topic2', 'database1'],
          status: 'active',
          messageCount: 0,
          icon: <Server className="w-5 h-5 text-orange-500" />
        },
        {
          id: 'topic1',
          type: 'topic',
          label: 'Notifications Topic',
          x: width * 0.65,
          y: height * 0.3,
          connections: ['consumer1', 'consumer2'],
          status: 'active',
          messageCount: 0,
          icon: <Layers className="w-5 h-5 text-purple-500" />
        },
        {
          id: 'topic2',
          type: 'topic',
          label: 'Orders Topic',
          x: width * 0.65,
          y: height * 0.7,
          connections: ['consumer3'],
          status: 'active',
          messageCount: 0,
          icon: <Layers className="w-5 h-5 text-green-500" />
        },
        {
          id: 'consumer1',
          type: 'consumer',
          label: 'Notification Service',
          x: width * 0.85,
          y: height * 0.15,
          connections: [],
          status: 'active',
          messageCount: 0,
          icon: <Activity className="w-5 h-5 text-blue-500" />
        },
        {
          id: 'consumer2',
          type: 'consumer',
          label: 'Email Service',
          x: width * 0.85,
          y: height * 0.45,
          connections: [],
          status: 'warning',
          messageCount: 0,
          icon: <Activity className="w-5 h-5 text-yellow-500" />
        },
        {
          id: 'consumer3',
          type: 'consumer',
          label: 'Order Processor',
          x: width * 0.85,
          y: height * 0.8,
          connections: [],
          status: 'active',
          messageCount: 0,
          icon: <Activity className="w-5 h-5 text-green-500" />
        },
        {
          id: 'database1',
          type: 'database',
          label: 'Message Archive',
          x: width * 0.5,
          y: height * 0.85,
          connections: [],
          status: 'active',
          messageCount: 0,
          icon: <Database className="w-5 h-5 text-blue-400" />
        }
      ];
      
      // Create links based on node connections
      const initialLinks: MessageLink[] = [];
      initialNodes.forEach(node => {
        node.connections.forEach(targetId => {
          initialLinks.push({
            source: node.id,
            target: targetId,
            active: node.status === 'active',
            messageCount: 0
          });
        });
      });
      
      setNodes(initialNodes);
      setLinks(initialLinks);
    }
  }, []);
  
  // Handle window resize more efficiently
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // Only update if dimensions have significantly changed
        if (Math.abs(width - dimensions.width) > 20 || Math.abs(height - dimensions.height) > 20) {
          setDimensions({ width, height });
          
          // Update node positions proportionally
          setNodes(prevNodes => prevNodes.map(node => {
            const relativeX = node.x / dimensions.width;
            const relativeY = node.y / dimensions.height;
            return {
              ...node,
              x: relativeX * width,
              y: relativeY * height
            };
          }));
        }
      }
    };
    
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);
    
    return () => window.removeEventListener('resize', debouncedResize);
  }, [dimensions]);
  
  // Simple debounce function to limit resize event handling
  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  
  // Auto-generate messages
  useEffect(() => {
    if (!autoGenerate) return;
    
    const generateInterval = setInterval(() => {
      // Randomly select an active producer
      const activeProducers = nodes.filter(n => n.type === 'producer' && n.status === 'active');
      if (activeProducers.length === 0) return;
      
      const randomProducer = activeProducers[Math.floor(Math.random() * activeProducers.length)];
      const path: string[] = [randomProducer.id];
      
      // Generate a random path through the network
      let currentNode = randomProducer;
      while (currentNode.connections.length > 0) {
        // Find all active connections
        const activeConnections = currentNode.connections.filter(connId => {
          const connNode = nodes.find(n => n.id === connId);
          return connNode && connNode.status !== 'inactive';
        });
        
        if (activeConnections.length === 0) break;
        
        // Select random connection
        const nextNodeId = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        path.push(nextNodeId);
        
        // Update current node
        const nextNode = nodes.find(n => n.id === nextNodeId);
        if (!nextNode || nextNode.connections.length === 0) break;
        currentNode = nextNode;
        
        // Prevent infinite loops by limiting path length
        if (path.length >= 5) break;
      }
      
      // Create animations for this path
      createMessageAnimationsAlongPath(path);
      
      // Update message counts
      updateMessageCounts(path);
      
    }, 1500);
    
    return () => clearInterval(generateInterval);
  }, [nodes, autoGenerate]);
  
  // Clean up completed animations
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setAnimatingMessages(prev => prev.filter(msg => {
        const elapsed = now - msg.startTime;
        return elapsed < msg.duration;
      }));
    }, 500);
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  const createMessageAnimationsAlongPath = (path: string[]) => {
    if (path.length < 2) return;
    
    const animations: AnimatingMessage[] = [];
    const startTime = Date.now();
    
    for (let i = 0; i < path.length - 1; i++) {
      animations.push({
        id: `${path[i]}-${path[i+1]}-${startTime}-${i}`,
        sourceId: path[i],
        targetId: path[i+1],
        startTime: startTime + (i * 500), // Stagger animations
        duration: 800
      });
    }
    
    setAnimatingMessages(prev => [...prev, ...animations]);
  };
  
  const updateMessageCounts = (path: string[]) => {
    // Update node message counts
    setNodes(prevNodes => prevNodes.map(node => {
      if (path.includes(node.id)) {
        return {
          ...node,
          messageCount: (node.messageCount || 0) + 1
        };
      }
      return node;
    }));
    
    // Update link message counts
    setLinks(prevLinks => prevLinks.map(link => {
      // Check if this link is in the path
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === link.source && path[i+1] === link.target) {
          return {
            ...link,
            messageCount: link.messageCount + 1,
            active: true
          };
        }
      }
      return link;
    }));
  };
  
  // Get node by ID
  const getNode = (id: string): MessageNode | undefined => {
    return nodes.find(node => node.id === id);
  };
  
  // Get path between two nodes
  const getPath = (sourceId: string, targetId: string): [number, number, number, number] => {
    const source = getNode(sourceId);
    const target = getNode(targetId);
    
    if (!source || !target) return [0, 0, 0, 0];
    
    return [source.x, source.y, target.x, target.y];
  };
  
  // Calculate the position of the message along the path
  const getMessagePosition = (animation: AnimatingMessage): { x: number, y: number } => {
    const [x1, y1, x2, y2] = getPath(animation.sourceId, animation.targetId);
    const elapsed = Date.now() - animation.startTime;
    const progress = Math.min(1, Math.max(0, elapsed / animation.duration));
    
    return {
      x: x1 + (x2 - x1) * progress,
      y: y1 + (y2 - y1) * progress
    };
  };
  
  // Get status color for nodes
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative border rounded-lg bg-background/50 backdrop-blur h-96 overflow-hidden",
        className
      )}
    >
      {/* Node connections (lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {links.map((link) => {
          const [x1, y1, x2, y2] = getPath(link.source, link.target);
          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={link.active ? "#9333ea" : "#e5e7eb"}
              strokeWidth={link.active ? 2 : 1}
              strokeDasharray={link.active ? "none" : "4,4"}
              className="transition-colors duration-300"
            />
          );
        })}
      </svg>
      
      {/* Animating messages */}
      <AnimatePresence>
        {animatingMessages.map((animation) => {
          const pos = getMessagePosition(animation);
          return (
            <motion.div
              key={animation.id}
              className="absolute z-10 w-3 h-3 rounded-full bg-primary shadow-glow"
              style={{
                left: pos.x - 6,
                top: pos.y - 6,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 0.5, opacity: 0 }}
            />
          );
        })}
      </AnimatePresence>
      
      {/* Nodes with adjusted sizing and positioning */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className={cn(
            "absolute z-20 flex flex-col items-center",
            node.status === 'inactive' ? "opacity-60" : "opacity-100"
          )}
          style={{
            left: node.x - 30, // Reduced from 40 to prevent edge overflows
            top: node.y - 30,  // Reduced from 40 to prevent edge overflows
            transform: 'translate(-50%, -50%)',
            width: '60px',     // Fixed width to ensure consistent sizing
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg border shadow-sm", // Reduced from w-16 h-16
            node.status === 'active' ? "bg-background" : "bg-muted"
          )}>
            {node.icon || <BarChart2 className="w-5 h-5 text-primary" />}
            {node.messageCount && node.messageCount > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {node.messageCount}
              </div>
            )}
          </div>
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 mt-1 flex flex-col items-center w-full">
            <div className="text-[0.65rem] font-medium text-center whitespace-nowrap max-w-24 overflow-hidden text-ellipsis">
              {node.label}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <div className={cn("h-1.5 w-1.5 rounded-full", getStatusColor(node.status))}></div>
              <div className="text-[0.6rem] text-muted-foreground">{node.status}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdvancedMessageFlow;
