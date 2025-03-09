
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  time?: string;
  avatar?: string;
  unread: number;
  lastSeen: string;
  isVerified?: boolean;
}

interface ContactListProps {
  activeContactId: string;
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ 
  activeContactId,
  onSelectContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample contact data
  const contacts: Contact[] = [
    {
      id: 'fikri-rustandi',
      name: 'Fikri Rustandi',
      lastMessage: 'Design director at Google and UX...',
      time: '12m',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: 'online',
      isVerified: true
    },
    {
      id: 'moch-ramdhani',
      name: 'Moch Ramdhani',
      lastMessage: 'Product designer at Tokopedia',
      time: '2h',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: 'online',
      isVerified: true
    },
    {
      id: 'abu-abdullah',
      name: 'Abu Abdullah Negraha',
      lastMessage: 'Online',
      time: '5h',
      avatar: '/lovable-uploads/43a8adcc-bd4c-4525-80f2-28576f3ad05b.png',
      unread: 3,
      lastSeen: 'online',
      isVerified: true
    },
    {
      id: 'muhammad-fauzi',
      name: 'Muhammad Fauzi',
      lastMessage: 'Art designer Apple Studio at Apple Inc...',
      time: '1d',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: '3h ago',
      isVerified: true
    },
    {
      id: 'norman-trisaputra',
      name: 'Norman Tri Saputra',
      lastMessage: 'Head Designer at Facebook',
      time: '2d',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: '5h ago',
      isVerified: false
    },
    {
      id: 'bagus-ilham',
      name: 'Bagus Ilham',
      lastMessage: 'Product designer at Tokopedia',
      time: '3d',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: 'yesterday',
      isVerified: true
    },
    {
      id: 'saipul-rohman',
      name: 'Saipul Rohman',
      lastMessage: 'Head Design at Gojek',
      time: '1w',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: '2d ago',
      isVerified: false
    },
    {
      id: 'muhammad-addaruqutni',
      name: 'Muhammad Addaruqutni',
      lastMessage: 'Saya lagi ke supermarket',
      time: '1w',
      avatar: '/placeholder.svg',
      unread: 0,
      lastSeen: '3d ago',
      isVerified: false
    }
  ];
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h2 className="font-medium text-sm">Chat</h2>
        <span className="text-xs py-1 px-2 bg-gray-200 rounded text-gray-700">NEW</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No contacts found
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredContacts.map(contact => (
              <li key={contact.id}>
                <button
                  onClick={() => onSelectContact(contact)}
                  className={`w-full px-3 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    activeContactId === contact.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}{contact.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.lastSeen === 'online' && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center">
                      <span className="font-medium text-sm truncate">{contact.name}</span>
                      {contact.isVerified && (
                        <span className="ml-1 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{contact.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">{contact.time}</span>
                    {contact.unread > 0 && (
                      <Badge 
                        variant="default" 
                        className="mt-1 h-5 min-w-[20px] bg-blue-500"
                      >
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContactList;
