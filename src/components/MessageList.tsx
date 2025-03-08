
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCard from './MessageCard';
import { MessageSquare, Filter, Search, Calendar, SlidersHorizontal, X } from 'lucide-react';
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
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from './ui/badge';

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
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  
  // Reset filters function
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter(undefined);
    setContentTypeFilter('all');
  };
  
  // Determine if a message is JSON
  const isJsonMessage = (content: string): boolean => {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  };
  
  const filteredMessages = messages
    .filter(message => message.type === type)
    .filter(message => 
      searchTerm ? message.content.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter(message => 
      statusFilter !== 'all' ? message.status === statusFilter : true
    )
    .filter(message => {
      if (!dateFilter) return true;
      
      const messageDate = new Date(message.timestamp);
      const filterDate = new Date(dateFilter);
      
      return messageDate.toDateString() === filterDate.toDateString();
    })
    .filter(message => {
      if (contentTypeFilter === 'all') return true;
      return contentTypeFilter === 'json' 
        ? isJsonMessage(message.content) 
        : !isJsonMessage(message.content);
    });
  
  // Calculate active filter count
  const activeFilterCount = [
    searchTerm !== '',
    statusFilter !== 'all',
    dateFilter !== undefined,
    contentTypeFilter !== 'all'
  ].filter(Boolean).length;
  
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
            <Badge 
              variant="secondary" 
              className={cn(
                "absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center", 
                activeFilterCount === 0 && "hidden"
              )}
            >
              {activeFilterCount}
            </Badge>
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
              {searchTerm && (
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSearchTerm('')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="consumed">Consumed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Type:</span>
                <Select 
                  value={contentTypeFilter} 
                  onValueChange={setContentTypeFilter}
                >
                  <SelectTrigger className="w-full h-8">
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Date:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {dateFilter && (
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setDateFilter(undefined)}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 flex items-center gap-1"
                onClick={resetFilters}
              >
                <SlidersHorizontal className="w-3 h-3" />
                Reset Filters
              </Button>
              
              {onClearMessages && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onClearMessages}
                  className="text-xs h-7"
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
            {activeFilterCount > 0 ? (
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your filters or 
                <Button variant="link" className="h-auto p-0 mx-1" onClick={resetFilters}>
                  reset all filters
                </Button>
              </p>
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
