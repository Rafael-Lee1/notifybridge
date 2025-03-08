
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Inbox, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowRight, 
  MessageSquare, 
  Folder, 
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  RefreshCcw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";

// Define types for topics and queues
interface Topic {
  id: string;
  name: string;
  description: string;
  messageCount: number;
  createdAt: Date;
  isActive: boolean;
  queueCount: number;
}

interface Queue {
  id: string;
  name: string;
  topicId: string;
  description: string;
  messageCount: number;
  createdAt: Date;
  isActive: boolean;
  consumers: number;
}

const TopicsQueues: React.FC = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [isAddingQueue, setIsAddingQueue] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingQueue, setEditingQueue] = useState<Queue | null>(null);
  
  // Form states
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newQueueName, setNewQueueName] = useState('');
  const [newQueueDescription, setNewQueueDescription] = useState('');
  const [newQueueTopic, setNewQueueTopic] = useState('');
  
  // Generate mock data
  useEffect(() => {
    // Mock topics
    const mockTopics: Topic[] = [
      {
        id: 'topic-1',
        name: 'User Events',
        description: 'All user-related events and notifications',
        messageCount: 1243,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        isActive: true,
        queueCount: 3
      },
      {
        id: 'topic-2',
        name: 'Orders',
        description: 'Order processing and status updates',
        messageCount: 856,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        isActive: true,
        queueCount: 2
      },
      {
        id: 'topic-3',
        name: 'Notifications',
        description: 'System notifications and alerts',
        messageCount: 542,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        isActive: true,
        queueCount: 2
      }
    ];
    
    // Mock queues
    const mockQueues: Queue[] = [
      {
        id: 'queue-1',
        name: 'user-registrations',
        topicId: 'topic-1',
        description: 'User registration events',
        messageCount: 356,
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 2
      },
      {
        id: 'queue-2',
        name: 'user-logins',
        topicId: 'topic-1',
        description: 'User login events',
        messageCount: 587,
        createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 1
      },
      {
        id: 'queue-3',
        name: 'user-profile-updates',
        topicId: 'topic-1',
        description: 'User profile update events',
        messageCount: 300,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 1
      },
      {
        id: 'queue-4',
        name: 'order-created',
        topicId: 'topic-2',
        description: 'New order creation events',
        messageCount: 456,
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 2
      },
      {
        id: 'queue-5',
        name: 'order-fulfilled',
        topicId: 'topic-2',
        description: 'Order fulfillment events',
        messageCount: 400,
        createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 1
      },
      {
        id: 'queue-6',
        name: 'system-alerts',
        topicId: 'topic-3',
        description: 'System-wide alerts',
        messageCount: 242,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 3
      },
      {
        id: 'queue-7',
        name: 'user-notifications',
        topicId: 'topic-3',
        description: 'User-facing notifications',
        messageCount: 300,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        isActive: true,
        consumers: 2
      }
    ];
    
    setTopics(mockTopics);
    setQueues(mockQueues);
    
    // Set default selected topic
    if (mockTopics.length > 0) {
      setSelectedTopic(mockTopics[0]);
      setNewQueueTopic(mockTopics[0].id);
    }
  }, []);
  
  // Filter topics and queues based on search term
  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredQueues = queues.filter(queue => 
    (selectedTopic ? queue.topicId === selectedTopic.id : true) &&
    (queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     queue.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Add a new topic
  const handleAddTopic = () => {
    if (!newTopicName.trim()) {
      toast({
        title: "Error",
        description: "Topic name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      name: newTopicName,
      description: newTopicDescription,
      messageCount: 0,
      createdAt: new Date(),
      isActive: true,
      queueCount: 0
    };
    
    setTopics([...topics, newTopic]);
    setNewTopicName('');
    setNewTopicDescription('');
    setIsAddingTopic(false);
    
    toast({
      title: "Success",
      description: `Topic "${newTopicName}" has been created`,
    });
  };
  
  // Add a new queue
  const handleAddQueue = () => {
    if (!newQueueName.trim()) {
      toast({
        title: "Error",
        description: "Queue name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!newQueueTopic) {
      toast({
        title: "Error",
        description: "Please select a topic for this queue",
        variant: "destructive"
      });
      return;
    }
    
    const newQueue: Queue = {
      id: `queue-${Date.now()}`,
      name: newQueueName,
      topicId: newQueueTopic,
      description: newQueueDescription,
      messageCount: 0,
      createdAt: new Date(),
      isActive: true,
      consumers: 0
    };
    
    setQueues([...queues, newQueue]);
    
    // Update topic queue count
    setTopics(topics.map(topic => {
      if (topic.id === newQueueTopic) {
        return {
          ...topic,
          queueCount: topic.queueCount + 1
        };
      }
      return topic;
    }));
    
    setNewQueueName('');
    setNewQueueDescription('');
    setIsAddingQueue(false);
    
    toast({
      title: "Success",
      description: `Queue "${newQueueName}" has been created`,
    });
  };
  
  // Edit topic
  const handleEditTopic = () => {
    if (!editingTopic) return;
    
    if (!editingTopic.name.trim()) {
      toast({
        title: "Error",
        description: "Topic name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setTopics(topics.map(topic => 
      topic.id === editingTopic.id ? editingTopic : topic
    ));
    
    // If the edited topic is the selected one, update it
    if (selectedTopic && selectedTopic.id === editingTopic.id) {
      setSelectedTopic(editingTopic);
    }
    
    setEditingTopic(null);
    
    toast({
      title: "Success",
      description: `Topic "${editingTopic.name}" has been updated`,
    });
  };
  
  // Edit queue
  const handleEditQueue = () => {
    if (!editingQueue) return;
    
    if (!editingQueue.name.trim()) {
      toast({
        title: "Error",
        description: "Queue name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setQueues(queues.map(queue => 
      queue.id === editingQueue.id ? editingQueue : queue
    ));
    
    setEditingQueue(null);
    
    toast({
      title: "Success",
      description: `Queue "${editingQueue.name}" has been updated`,
    });
  };
  
  // Delete topic
  const handleDeleteTopic = (topicId: string) => {
    // Check if there are queues associated with this topic
    const associatedQueues = queues.filter(queue => queue.topicId === topicId);
    
    if (associatedQueues.length > 0) {
      toast({
        title: "Cannot Delete Topic",
        description: `This topic has ${associatedQueues.length} associated queues. Delete the queues first.`,
        variant: "destructive"
      });
      return;
    }
    
    const topicToDelete = topics.find(t => t.id === topicId);
    
    setTopics(topics.filter(topic => topic.id !== topicId));
    
    // If deleting the selected topic, set to null or the first available
    if (selectedTopic && selectedTopic.id === topicId) {
      const remainingTopics = topics.filter(topic => topic.id !== topicId);
      setSelectedTopic(remainingTopics.length > 0 ? remainingTopics[0] : null);
    }
    
    toast({
      title: "Topic Deleted",
      description: `Topic "${topicToDelete?.name}" has been deleted`,
    });
  };
  
  // Delete queue
  const handleDeleteQueue = (queueId: string) => {
    const queueToDelete = queues.find(q => q.id === queueId);
    
    if (queueToDelete) {
      // Decrease the queue count for the associated topic
      setTopics(topics.map(topic => {
        if (topic.id === queueToDelete.topicId) {
          return {
            ...topic,
            queueCount: Math.max(0, topic.queueCount - 1)
          };
        }
        return topic;
      }));
    }
    
    setQueues(queues.filter(queue => queue.id !== queueId));
    
    toast({
      title: "Queue Deleted",
      description: `Queue "${queueToDelete?.name}" has been deleted`,
    });
  };
  
  // Toggle active state for topic
  const handleToggleTopicActive = (topicId: string) => {
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        const newState = !topic.isActive;
        
        // Also update all associated queues
        setQueues(queues.map(queue => {
          if (queue.topicId === topicId) {
            return { ...queue, isActive: newState };
          }
          return queue;
        }));
        
        return { ...topic, isActive: newState };
      }
      return topic;
    }));
  };
  
  // Toggle active state for queue
  const handleToggleQueueActive = (queueId: string) => {
    setQueues(queues.map(queue => {
      if (queue.id === queueId) {
        return { ...queue, isActive: !queue.isActive };
      }
      return queue;
    }));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-7xl py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Topics & Queues</h1>
              <p className="text-muted-foreground">
                Create and manage message topics and queues
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddingTopic} onOpenChange={setIsAddingTopic}>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    New Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Topic</DialogTitle>
                    <DialogDescription>
                      Add a new topic to organize your message queues
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="topic-name">Topic Name</Label>
                      <Input 
                        id="topic-name" 
                        value={newTopicName} 
                        onChange={(e) => setNewTopicName(e.target.value)} 
                        placeholder="e.g., UserEvents" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="topic-description">Description</Label>
                      <Input 
                        id="topic-description" 
                        value={newTopicDescription} 
                        onChange={(e) => setNewTopicDescription(e.target.value)} 
                        placeholder="Describe the purpose of this topic"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddTopic}>Create Topic</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddingQueue} onOpenChange={setIsAddingQueue}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    New Queue
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Queue</DialogTitle>
                    <DialogDescription>
                      Add a new message queue to a topic
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="queue-name">Queue Name</Label>
                      <Input 
                        id="queue-name" 
                        value={newQueueName} 
                        onChange={(e) => setNewQueueName(e.target.value)} 
                        placeholder="e.g., user-registrations" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="queue-topic">Topic</Label>
                      <select 
                        id="queue-topic"
                        value={newQueueTopic}
                        onChange={(e) => setNewQueueTopic(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {topics.map(topic => (
                          <option key={topic.id} value={topic.id}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="queue-description">Description</Label>
                      <Input 
                        id="queue-description" 
                        value={newQueueDescription} 
                        onChange={(e) => setNewQueueDescription(e.target.value)} 
                        placeholder="Describe the purpose of this queue"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddQueue}>Create Queue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      Topics
                    </span>
                    <Badge>{topics.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="relative mb-4">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      {filteredTopics.map(topic => (
                        <div
                          key={topic.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            selectedTopic?.id === topic.id ? 'bg-accent' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedTopic(topic)}
                        >
                          <div className="flex items-center space-x-2">
                            <Folder className={`h-4 w-4 ${topic.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="truncate max-w-[120px]">{topic.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className="text-xs">
                              {topic.queueCount}
                            </Badge>
                            
                            <Dialog>
                              <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Topic</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-topic-name">Topic Name</Label>
                                    <Input
                                      id="edit-topic-name"
                                      value={editingTopic?.name || topic.name}
                                      onChange={(e) => setEditingTopic({
                                        ...(editingTopic || topic),
                                        name: e.target.value
                                      })}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!editingTopic) setEditingTopic(topic);
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-topic-description">Description</Label>
                                    <Input
                                      id="edit-topic-description"
                                      value={editingTopic?.description || topic.description}
                                      onChange={(e) => setEditingTopic({
                                        ...(editingTopic || topic),
                                        description: e.target.value
                                      })}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!editingTopic) setEditingTopic(topic);
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-topic-status">Status</Label>
                                    <div className="flex items-center">
                                      <Button
                                        variant={editingTopic?.isActive || topic.isActive ? "default" : "outline"}
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingTopic({
                                            ...(editingTopic || topic),
                                            isActive: true
                                          });
                                        }}
                                        className="rounded-r-none"
                                      >
                                        Active
                                      </Button>
                                      <Button
                                        variant={!(editingTopic?.isActive || topic.isActive) ? "default" : "outline"}
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingTopic({
                                            ...(editingTopic || topic),
                                            isActive: false
                                          });
                                        }}
                                        className="rounded-l-none"
                                      >
                                        Inactive
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline" onClick={() => setEditingTopic(null)}>
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button onClick={handleEditTopic}>Save Changes</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Topic</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete the topic "{topic.name}"? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteTopic(topic.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                      
                      {filteredTopics.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          {searchTerm ? "No topics match your search" : "No topics available"}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-1">
                      <Inbox className="h-4 w-4" />
                      {selectedTopic ? (
                        <span>Queues for {selectedTopic.name}</span>
                      ) : (
                        <span>All Queues</span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {filteredQueues.length} queues
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => setSearchTerm('')}
                      >
                        <RefreshCcw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {selectedTopic?.description || "Manage all message queues across topics"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search queues..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Queue table header */}
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div className="col-span-3 flex items-center">
                        <span>Name</span>
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                      </div>
                      <div className="col-span-3">Description</div>
                      <div className="col-span-2 text-right">Messages</div>
                      <div className="col-span-2 text-right">Consumers</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    {/* Queue list */}
                    <div className="space-y-2">
                      {filteredQueues.map(queue => (
                        <div key={queue.id} className="grid grid-cols-12 gap-4 items-center border-b pb-2 text-sm">
                          <div className="col-span-3 flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${queue.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="font-medium">{queue.name}</span>
                          </div>
                          <div className="col-span-3 text-muted-foreground truncate">
                            {queue.description || "No description"}
                          </div>
                          <div className="col-span-2 text-right">
                            <Badge variant="secondary">{queue.messageCount}</Badge>
                          </div>
                          <div className="col-span-2 text-right">
                            <Badge variant="outline">{queue.consumers}</Badge>
                          </div>
                          <div className="col-span-2 flex justify-end items-center space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Queue</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-queue-name">Queue Name</Label>
                                    <Input
                                      id="edit-queue-name"
                                      value={editingQueue?.name || queue.name}
                                      onChange={(e) => setEditingQueue({
                                        ...(editingQueue || queue),
                                        name: e.target.value
                                      })}
                                      onClick={() => {
                                        if (!editingQueue) setEditingQueue(queue);
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-queue-topic">Topic</Label>
                                    <select 
                                      id="edit-queue-topic"
                                      value={editingQueue?.topicId || queue.topicId}
                                      onChange={(e) => setEditingQueue({
                                        ...(editingQueue || queue),
                                        topicId: e.target.value
                                      })}
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {topics.map(topic => (
                                        <option key={topic.id} value={topic.id}>
                                          {topic.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-queue-description">Description</Label>
                                    <Input
                                      id="edit-queue-description"
                                      value={editingQueue?.description || queue.description}
                                      onChange={(e) => setEditingQueue({
                                        ...(editingQueue || queue),
                                        description: e.target.value
                                      })}
                                      onClick={() => {
                                        if (!editingQueue) setEditingQueue(queue);
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-queue-status">Status</Label>
                                    <div className="flex items-center">
                                      <Button
                                        variant={editingQueue?.isActive || queue.isActive ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setEditingQueue({
                                          ...(editingQueue || queue),
                                          isActive: true
                                        })}
                                        className="rounded-r-none"
                                      >
                                        Active
                                      </Button>
                                      <Button
                                        variant={!(editingQueue?.isActive || queue.isActive) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setEditingQueue({
                                          ...(editingQueue || queue),
                                          isActive: false
                                        })}
                                        className="rounded-l-none"
                                      >
                                        Inactive
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline" onClick={() => setEditingQueue(null)}>
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button onClick={handleEditQueue}>Save Changes</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Queue</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete the queue "{queue.name}"? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteQueue(queue.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                      
                      {filteredQueues.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          {searchTerm 
                            ? "No queues match your search"
                            : selectedTopic 
                              ? `No queues found for topic "${selectedTopic.name}"`
                              : "No queues available"
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TopicsQueues;
