
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Info, Github, Settings, Archive, BarChart2, Folder, BookOpen, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserProfileMenu from './UserProfileMenu';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { to: "/broker-info", icon: <Info className="h-4 w-4" />, label: "Broker Info" },
    { to: "/monitoring", icon: <BarChart2 className="h-4 w-4" />, label: "Monitoring" },
    { to: "/topics-queues", icon: <Folder className="h-4 w-4" />, label: "Topics & Queues" },
    { to: "/message-archive", icon: <Archive className="h-4 w-4" />, label: "Archive" },
    { to: "/docs", icon: <BookOpen className="h-4 w-4" />, label: "Documentation" },
  ];

  // Only show settings for admin
  if (user?.role === 'admin') {
    navLinks.push({ to: "/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" });
  }
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="hidden font-bold sm:inline-block">
              Messaging System
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isAuthenticated && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      {link.icon}
                      <span>{link.label}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Navigation */}
              <div className="md:hidden flex flex-1 justify-end">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                    <div className="flex flex-col py-6">
                      <Link to="/" className="flex items-center gap-2 mb-6">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-bold">Messaging System</span>
                      </Link>
                      <nav className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                          <Link key={link.to} to={link.to} className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-secondary">
                            {link.icon}
                            <span>{link.label}</span>
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
          
          <div className="flex items-center gap-2">
            <UserProfileMenu />
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/Rafael-Lee1/notifybridge.git"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
