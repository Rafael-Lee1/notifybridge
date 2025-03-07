
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageFlowProps {
  isActive: boolean;
  className?: string;
}

const MessageFlow: React.FC<MessageFlowProps> = ({ isActive, className }) => {
  return (
    <div className={cn("w-full h-20 relative", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1 bg-muted w-full relative">
          {isActive && (
            <>
              <motion.div
                initial={{ x: '-100%', opacity: 0.7 }}
                animate={{ 
                  x: '100%', 
                  opacity: [0.7, 1, 0.7],
                  transition: { 
                    x: { duration: 2, ease: "easeInOut", repeat: Infinity },
                    opacity: { duration: 2, ease: "easeInOut", repeat: Infinity, times: [0, 0.5, 1] }
                  }
                }}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-16 h-2 bg-primary rounded-full"
              />
              
              <motion.div
                initial={{ x: '-100%', opacity: 0.7 }}
                animate={{ 
                  x: '100%', 
                  opacity: [0.7, 1, 0.7],
                  transition: { 
                    x: { duration: 2, ease: "easeInOut", repeat: Infinity, delay: 0.7 },
                    opacity: { duration: 2, ease: "easeInOut", repeat: Infinity, times: [0, 0.5, 1], delay: 0.7 }
                  }
                }}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-2 bg-primary/70 rounded-full"
              />
            </>
          )}
        </div>
        
        <motion.div 
          animate={{ 
            y: isActive ? [0, -5, 0] : 0,
            transition: { 
              y: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
            }
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <ArrowRight className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
      
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          className="w-12 h-12 bg-primary bg-opacity-10 rounded-full grid place-items-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-primary">
            <path d="M22 7L13 7M22 17L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 17C8 19.7614 10.2386 22 13 22C15.7614 22 18 19.7614 18 17C18 14.2386 15.7614 12 13 12C10.2386 12 8 14.2386 8 17Z" stroke="currentColor" strokeWidth="2" />
            <path d="M2 17.5H8M2 7H8M18 7C18 9.76142 15.7614 12 13 12C10.2386 12 8 9.76142 8 7C8 4.23858 10.2386 2 13 2C15.7614 2 18 4.23858 18 7Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
        <span className="text-xs font-medium mt-1">Producer</span>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, delay: 1 }}
          className="w-12 h-12 bg-secondary rounded-full grid place-items-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-foreground">
            <path d="M2 7H11M2 17H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 7C16 4.23858 13.7614 2 11 2C8.23858 2 6 4.23858 6 7C6 9.76142 8.23858 12 11 12C13.7614 12 16 9.76142 16 7Z" stroke="currentColor" strokeWidth="2" />
            <path d="M22 17.5H16M22 7H16M6 17C6 14.2386 8.23858 12 11 12C13.7614 12 16 14.2386 16 17C16 19.7614 13.7614 22 11 22C8.23858 22 6 19.7614 6 17Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
        <span className="text-xs font-medium mt-1">Consumer</span>
      </div>
    </div>
  );
};

export default MessageFlow;
