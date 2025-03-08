
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Filter, 
  Archive, 
  MessageSquare, 
  Download,
  ArrowLeft,
  ArrowRight,
  Trash,
  X,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Message } from '@/components/MessageList';
import MessageCard from '@/components/MessageCard';

const MessageArchive = () => {
  // Load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('messageHistory');
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (e) {
      console.error('Failed to load message history:', e);
      return [];
    }
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  // Determine if a message is JSON
  const isJsonMessage = (content: string): boolean => {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  };

  // Reset filters function
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateFilter(undefined);
    setContentTypeFilter('all');
    setCurrentPage(1);
  };

  // Filter messages
  const filteredMessages = messages
    .filter(message => 
      searchTerm ? message.content.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter(message => 
      typeFilter !== 'all' ? message.type === typeFilter : true
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
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Calculate active filter count
  const activeFilterCount = [
    searchTerm !== '',
    typeFilter !== 'all',
    statusFilter !== 'all',
    dateFilter !== undefined,
    contentTypeFilter !== 'all'
  ].filter(Boolean).length;

  // Export messages as JSON
  const handleExportMessages = () => {
    try {
      const dataStr = JSON.stringify(filteredMessages, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `message-archive-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Messages exported successfully');
    } catch (e) {
      console.error('Export failed:', e);
      toast.error('Failed to export messages');
    }
  };

  // Clear all messages
  const handleClearAllMessages = () => {
    if (window.confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
      localStorage.setItem('messageHistory', JSON.stringify([]));
      setMessages([]);
      toast.success('All messages cleared');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 container max-w-7xl mx-auto px-4 py-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Archive className="h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">Message Archive</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleExportMessages}
              disabled={filteredMessages.length === 0}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
              onClick={handleClearAllMessages}
              disabled={messages.length === 0}
            >
              <Trash className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="px-2 py-1">
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                </Badge>
              )}
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={resetFilters}
                >
                  Reset All
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Content</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type-filter">Message Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="consumed">Consumed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-type-filter">Content Format</Label>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger id="content-type-filter">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-filter">Date</Label>
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-filter"
                      variant="outline"
                      size="sm"
                      className={`w-full justify-start text-left font-normal ${!dateFilter && "text-muted-foreground"}`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                {dateFilter && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setDateFilter(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Select 
                value={sortOrder} 
                onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
              >
                <SelectTrigger id="sort-order">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="bg-background border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
              <Badge variant="secondary" className="ml-2">
                {filteredMessages.length}
              </Badge>
            </h2>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
              <Archive className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-lg">No messages found</p>
              {activeFilterCount > 0 ? (
                <p className="text-sm max-w-md">
                  No messages match your current filter criteria. Try adjusting your filters or 
                  <Button variant="link" className="h-auto p-0 mx-1" onClick={resetFilters}>
                    reset all filters
                  </Button>
                </p>
              ) : (
                <p className="text-sm max-w-md">
                  There are no messages in the archive yet. Messages will appear here once they are sent or received.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <MessageCard
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    type={message.type}
                    status={message.status}
                    className="max-w-full"
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {indexOfFirstMessage + 1}-{Math.min(indexOfLastMessage, filteredMessages.length)} of {filteredMessages.length} messages
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={i}
                          variant={pageNumber === currentPage ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.main>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-6 border-t"
      >
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Message Archive Explorer
          </p>
          <p className="text-sm text-muted-foreground">
            Total Messages: {messages.length}
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default MessageArchive;
