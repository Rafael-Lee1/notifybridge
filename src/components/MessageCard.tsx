
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageCardProps {
  id: string;
  content: string;
  timestamp: string;
  type: 'producer' | 'consumer';
  status?: 'pending' | 'delivered' | 'consumed';
  className?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

const MessageCard: React.FC<MessageCardProps> = ({
  id,
  content,
  timestamp,
  type,
  status = 'delivered',
  className,
  sender
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

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
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
        "rounded-lg p-4 border mb-3 max-w-md shadow-sm hover:shadow-md transition-all",
        getStatusColor(),
        isProducer ? "bg-blue-50 ml-auto" : "bg-white mr-auto",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {!isProducer && sender && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              {isProducer ? 'You' : sender?.name || 'Contact'}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timestamp)}
            </span>
          </div>
          
          <div className="mb-2">
            <p className="text-sm">{content}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{id.substring(0, 8)}...</span>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="capitalize">{status}</span>
            </div>
          </div>
        </div>
        
        {isProducer && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="/placeholder.svg" alt="You" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  );
};

export default MessageCard;
