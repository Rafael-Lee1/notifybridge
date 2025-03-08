import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { 
  Save, 
  Copy, 
  Send, 
  MessageCircle, 
  History, 
  ArrowRight, 
  Plus, 
  Star, 
  Trash,
  Code,
  Bookmark,
  BookmarkCheck,
  FileJson
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProducerPanelProps {
  onSendMessage: (message: string) => void;
  className?: string;
  recentMessages?: string[];
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  isCustom?: boolean;
}

// Default message templates
const DEFAULT_MESSAGE_TEMPLATES: MessageTemplate[] = [
  { id: 'template1', name: 'Order Created', content: '{"event":"order_created","orderId":"ORD-123","items":3,"total":59.99}', isCustom: false },
  { id: 'template2', name: 'Payment Processed', content: '{"event":"payment_processed","orderId":"ORD-123","amount":59.99,"status":"success"}', isCustom: false },
  { id: 'template3', name: 'Shipment Update', content: '{"event":"shipment_update","orderId":"ORD-123","status":"shipped","eta":"2023-09-15"}', isCustom: false },
  { id: 'template4', name: 'User Registered', content: '{"event":"user_registered","userId":"USR-456","email":"user@example.com"}', isCustom: false },
];

const ProducerPanel: React.FC<ProducerPanelProps> = ({ 
  onSendMessage, 
  className,
  recentMessages = []
}) => {
  // Load custom templates from localStorage
  const loadCustomTemplates = (): MessageTemplate[] => {
    try {
      const saved = localStorage.getItem('customMessageTemplates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load custom templates:', e);
      return [];
    }
  };

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<MessageTemplate[]>(loadCustomTemplates);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isJsonValid, setIsJsonValid] = useState<boolean | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Combine default and custom templates
  const allTemplates = [...DEFAULT_MESSAGE_TEMPLATES, ...customTemplates];
  
  // Save custom templates to localStorage
  useEffect(() => {
    localStorage.setItem('customMessageTemplates', JSON.stringify(customTemplates));
  }, [customTemplates]);
  
  // Check if message is valid JSON
  useEffect(() => {
    if (!message) {
      setIsJsonValid(null);
      return;
    }
    
    if (message.trim().startsWith('{') || message.trim().startsWith('[')) {
      try {
        JSON.parse(message);
        setIsJsonValid(true);
      } catch (e) {
        setIsJsonValid(false);
      }
    } else {
      setIsJsonValid(null);
    }
  }, [message]);
  
  const formatJson = () => {
    if (!message) return;
    
    try {
      const parsed = JSON.parse(message);
      const formatted = JSON.stringify(parsed, null, 2);
      setMessage(formatted);
    } catch (e) {
      toast.error('Invalid JSON: Cannot format');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message to send");
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      onSendMessage(message);
      setMessage('');
      setIsSending(false);
      toast.success("Message sent to the queue");
    }, 800);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      toast.info(`Template "${template.name}" loaded`);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard");
  };

  const handleHistorySelect = (historicalMessage: string) => {
    setMessage(historicalMessage);
    setShowHistory(false);
    toast.info("Historical message loaded");
  };
  
  const saveAsTemplate = () => {
    if (!message.trim()) {
      toast.error("Cannot save empty message as template");
      return;
    }
    
    if (!newTemplateName.trim()) {
      toast.error("Please provide a template name");
      return;
    }
    
    const newTemplate: MessageTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      content: message,
      isCustom: true
    };
    
    setCustomTemplates([...customTemplates, newTemplate]);
    setNewTemplateName('');
    toast.success(`Template "${newTemplateName}" saved`);
  };
  
  const deleteCustomTemplate = (id: string) => {
    setCustomTemplates(customTemplates.filter(t => t.id !== id));
    toast.info("Template deleted");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg border bg-background p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Producer</h2>
          <p className="text-sm text-muted-foreground">Send messages to the queue</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isSending ? "bg-yellow-500" : "bg-green-500"
          )}></div>
          <span className="text-xs">{isSending ? "Sending..." : "Ready"}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Message Content</span>
          
          <div className="ml-auto flex gap-2">
            {recentMessages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs h-8 flex items-center gap-1"
              >
                <History className="w-3 h-3" />
                History
              </Button>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Message Templates</DialogTitle>
                  <DialogDescription>
                    Choose a template or create your own.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="default" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="default" className="min-h-[200px]">
                    <div className="space-y-2 mt-2">
                      {DEFAULT_MESSAGE_TEMPLATES.map(template => (
                        <div 
                          key={template.id}
                          className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 cursor-pointer"
                          onClick={() => {
                            handleTemplateSelect(template.id);
                            // Close dialog
                            const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
                            if (closeButton) closeButton.click();
                          }}
                        >
                          <div>
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                              {template.content}
                            </div>
                          </div>
                          <FileJson className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom" className="min-h-[200px]">
                    <div className="space-y-2 mt-2">
                      {customTemplates.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p>No custom templates yet</p>
                          <p className="text-xs mt-1">Save your frequently used messages as templates</p>
                        </div>
                      ) : (
                        customTemplates.map(template => (
                          <div 
                            key={template.id}
                            className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50"
                          >
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => {
                                handleTemplateSelect(template.id);
                                // Close dialog
                                const closeButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
                                if (closeButton) closeButton.click();
                              }}
                            >
                              <div className="font-medium text-sm">{template.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                                {template.content}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => deleteCustomTemplate(template.id)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                      
                      <div className="pt-4 border-t mt-4">
                        <div className="text-sm font-medium mb-2">Save Current Message as Template</div>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Template name"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Button
                            type="button"
                            onClick={saveAsTemplate}
                            size="sm"
                            className="h-8"
                            disabled={!message.trim() || !newTemplateName.trim()}
                          >
                            <BookmarkCheck className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Quick templates" />
              </SelectTrigger>
              <SelectContent>
                {allTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} {template.isCustom && "⭐"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showHistory && recentMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 border rounded-md p-2 max-h-32 overflow-y-auto bg-muted/30"
          >
            <div className="text-xs font-medium mb-1 text-muted-foreground">Recent Messages</div>
            {recentMessages.slice(0, 5).map((msg, idx) => (
              <div 
                key={idx} 
                className="text-xs p-1 hover:bg-muted rounded cursor-pointer flex items-center justify-between"
                onClick={() => handleHistorySelect(msg)}
              >
                <div className="truncate max-w-[250px]">{msg}</div>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
          </motion.div>
        )}
        
        <div>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your message content..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] font-mono text-sm resize-none pr-8"
            />
            <div className="absolute right-2 top-2 flex flex-col gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopyToClipboard}
                    disabled={!message.trim()}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
              
              {isJsonValid !== null && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={formatJson}
                      disabled={!isJsonValid}
                    >
                      <Code className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format JSON</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-2">
            <div className="text-xs text-muted-foreground">
              {message.length} characters
            </div>
            {isJsonValid !== null && (
              <div className={cn(
                "text-xs flex items-center gap-1",
                isJsonValid ? "text-green-500" : "text-red-500"
              )}>
                <FileJson className="w-3 h-3" />
                {isJsonValid ? "Valid JSON" : "Invalid JSON"}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={isSending || !message.trim()}
            className="relative overflow-hidden"
          >
            {isSending ? (
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              <>
                <Send className="mr-1 h-4 w-4" />
                Send Message
              </>
            )}
            
            {isSending && (
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProducerPanel;
