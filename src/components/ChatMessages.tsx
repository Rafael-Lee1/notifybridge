
import React, { useRef, useEffect } from 'react';
import { Message } from '@/components/MessageList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Phone, Video, MoreVertical } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  lastSeen: string;
  avatar?: string;
  isVerified?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  activeContact: Contact;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages,
  activeContact
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Display messages in chronological order (oldest first)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activeContact.avatar} />
              <AvatarFallback>
                {activeContact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {activeContact.lastSeen === 'online' && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h2 className="text-sm font-medium">{activeContact.name}</h2>
              {activeContact.isVerified && (
                <span className="ml-1 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {activeContact.lastSeen === 'online' ? 'Online' : `Last seen ${activeContact.lastSeen}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Phone className="w-5 h-5 text-blue-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Video className="w-5 h-5 text-blue-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4"
      >
        {sortedMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          sortedMessages.map((message, index) => {
            const isProducer = message.type === 'producer';
            
            // Determine if we should show the timestamp
            const showTimestamp = index === 0 || 
              new Date(message.timestamp).getTime() - 
              new Date(sortedMessages[index - 1].timestamp).getTime() > 10 * 60 * 1000; // 10 minutes
            
            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="text-center my-4">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {format(new Date(message.timestamp), 'MMMM d, h:mm a')}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isProducer ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[75%] ${isProducer ? 'flex-row-reverse' : ''}`}>
                    {!isProducer && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activeContact.avatar} />
                        <AvatarFallback>
                          {activeContact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div 
                        className={`px-4 py-2 rounded-lg text-sm ${
                          isProducer 
                            ? 'bg-blue-500 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-tl-none border'
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className={`text-xs mt-1 text-gray-500 ${isProducer ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                    {isProducer && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
