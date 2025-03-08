
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Info, Github } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header: React.FC = () => {
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
          <nav className="flex items-center">
            <Link to="/broker-info">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Info className="h-4 w-4" />
                <span>Broker Info</span>
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/example/messaging-system"
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
