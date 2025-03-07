
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCard from './MessageCard';
import { MessageSquare } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          <MessageSquare className={cn(
            "w-5 h-5",
            type === 'producer' ? "text-primary" : "text-foreground"
          )} />
          <h2 className="text-lg font-semibold">
            {type === 'producer' ? 'Sent Messages' : 'Received Messages'}
          </h2>
        </div>
        <motion.div 
          className="text-sm text-muted-foreground flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
        </motion.div>
      </div>
      
      <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100% - 3rem)' }}>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            <p>No messages {type === 'producer' ? 'sent' : 'received'} yet</p>
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
