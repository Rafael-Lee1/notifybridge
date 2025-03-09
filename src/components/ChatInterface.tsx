
import React, { useState, useEffect } from 'react';
import { Message } from '@/components/MessageList';
import ContactList from '@/components/ContactList';
import ChatMessages from '@/components/ChatMessages';
import AgendaPanel from '@/components/AgendaPanel';
import { v4 as uuidv4 } from 'uuid';
import { Search, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

// Define Contact type to match ContactList component
interface Contact {
  id: string;
  name: string;
  lastSeen: string;
  avatar?: string;
  unread: number;
  isVerified?: boolean;
  lastMessage?: string;
  time?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages,
  onSendMessage
}) => {
  const [activeContact, setActiveContact] = useState<Contact>({
    id: 'abu-abdullah',
    name: 'Abu Abdullah Negraha',
    lastSeen: 'online',
    avatar: '/lovable-uploads/43a8adcc-bd4c-4525-80f2-28576f3ad05b.png',
    unread: 0,
    isVerified: true
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      setCurrentMessage('');
    }
  };

  // Filter messages for the current active contact
  const contactMessages = messages.filter(msg => 
    msg.type === 'producer' || msg.type === 'consumer'
  );

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[800px] flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-blue-500 text-white">
        <div className="flex items-center">
          <button 
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="p-2 mr-2 rounded-full hover:bg-blue-600 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Messenger</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center px-3 py-1.5 bg-blue-600/50 rounded-full">
            <Search className="w-4 h-4 text-blue-100 mr-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none text-sm text-white placeholder-blue-200 focus:outline-none w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm">Riko Sapto Dimo</span>
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Contact list - hidden on mobile unless toggled */}
        <div className={`${showMobileSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-72 border-r bg-white`}>
          <ContactList 
            activeContactId={activeContact.id}
            onSelectContact={(contact) => setActiveContact(contact)}
          />
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <ChatMessages 
            messages={contactMessages} 
            activeContact={activeContact}
          />
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="px-4 py-3 bg-white border-t flex items-center gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 3 3 9-3 9 19-9Z" />
                <path d="M6 12h16" />
              </svg>
            </button>
          </form>
        </div>

        {/* Agenda panel - hidden on mobile */}
        <div className="hidden md:block w-72 border-l bg-white">
          <AgendaPanel />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
