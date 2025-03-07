
import React from 'react';
import { motion } from 'framer-motion';
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "rounded-lg p-4 border mb-3 max-w-md",
        isProducer ? "bg-white" : "bg-secondary",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            status === 'pending' ? "bg-yellow-500" :
            status === 'delivered' ? "bg-blue-500" :
            "bg-green-500"
          )}></div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isProducer ? 'Producer' : 'Consumer'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
      
      <div className="mb-2">
        <p className="text-sm font-mono bg-muted/50 p-2 rounded">{content}</p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>ID: {id.substring(0, 8)}...</span>
        <span className="capitalize">{status}</span>
      </div>
    </motion.div>
  );
};

export default MessageCard;
