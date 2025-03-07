
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageCardProps {
  id: string;
  content: string;
  timestamp: string;
  type: 'producer' | 'consumer';
  status?: 'pending' | 'delivered' | 'consumed';
  className?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  id,
  content,
  timestamp,
  type,
  status = 'delivered',
  className,
}) => {
  const isProducer = type === 'producer';
  
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'consumed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return "border-l-yellow-500";
      case 'delivered':
        return "border-l-blue-500";
      case 'consumed':
        return "border-l-green-500";
      default:
        return "border-l-red-500";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-lg p-4 border mb-3 max-w-md border-l-4 shadow-sm hover:shadow-md transition-all",
        getStatusColor(),
        isProducer ? "bg-white" : "bg-secondary",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className={cn(
            "w-4 h-4",
            isProducer ? "text-primary" : "text-foreground"
          )} />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isProducer ? 'Producer' : 'Consumer'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timestamp}
        </span>
      </div>
      
      <div className="mb-2">
        <p className="text-sm font-mono bg-muted/50 p-2 rounded">{content}</p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">{id.substring(0, 8)}...</span>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className="capitalize">{status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageCard;
