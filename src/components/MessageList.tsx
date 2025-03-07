
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCard from './MessageCard';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'producer' | 'consumer';
  status: 'pending' | 'delivered' | 'consumed';
}

interface MessageListProps {
  messages: Message[];
  type: 'producer' | 'consumer';
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, type, className }) => {
  const filteredMessages = messages.filter(message => message.type === type);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg border bg-background p-4 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {type === 'producer' ? 'Sent Messages' : 'Received Messages'}
        </h2>
        <span className="text-sm text-muted-foreground">
          {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100% - 3rem)' }}>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No messages {type === 'producer' ? 'sent' : 'received'} yet
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredMessages.map(message => (
              <MessageCard
                key={message.id}
                id={message.id}
                content={message.content}
                timestamp={message.timestamp}
                type={message.type}
                status={message.status}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default MessageList;
