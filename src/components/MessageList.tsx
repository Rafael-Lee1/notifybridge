
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCard from './MessageCard';
import { MessageSquare, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

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
  onClearMessages?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  type, 
  className,
  onClearMessages 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const filteredMessages = messages
    .filter(message => message.type === type)
    .filter(message => 
      searchTerm ? message.content.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter(message => 
      statusFilter !== 'all' ? message.status === statusFilter : true
    );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg border bg-background p-4 overflow-hidden flex flex-col h-full",
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
        <div className="flex items-center gap-2">
          <motion.div 
            className="text-sm text-muted-foreground flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
          </motion.div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-muted")}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 border-b pb-4 grid gap-2"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="consumed">Consumed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {onClearMessages && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onClearMessages}
                  className="text-xs h-8"
                >
                  Clear History
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="overflow-y-auto pr-2 flex-1">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            <p>No messages {type === 'producer' ? 'sent' : 'received'} yet</p>
            {searchTerm || statusFilter !== 'all' ? (
              <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
            ) : null}
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
