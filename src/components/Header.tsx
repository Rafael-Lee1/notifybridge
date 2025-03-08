
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Info, Github, Settings, Archive, BarChart2, Folder, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserProfileMenu from './UserProfileMenu';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
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
            <nav className="flex items-center space-x-2">
              <Link to="/broker-info">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Info className="h-4 w-4" />
                  <span>Broker Info</span>
                </Button>
              </Link>
              <Link to="/monitoring">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span>Monitoring</span>
                </Button>
              </Link>
              <Link to="/topics-queues">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Folder className="h-4 w-4" />
                  <span>Topics & Queues</span>
                </Button>
              </Link>
              <Link to="/message-archive">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Documentation</span>
                </Button>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/settings">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                </Link>
              )}
            </nav>
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
