
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import BrokerInfo from "./pages/BrokerInfo";
import Settings from "./pages/Settings";
import MessageArchive from "./pages/MessageArchive";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import TopicsQueues from "./pages/TopicsQueues";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Documentation from "./pages/Documentation";
import Profile from "./pages/Profile";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute element={<Index />} />} />
            <Route path="/broker-info" element={<ProtectedRoute element={<BrokerInfo />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} requiredRoles={['admin']} />} />
            <Route path="/message-archive" element={<ProtectedRoute element={<MessageArchive />} />} />
            <Route path="/monitoring" element={<ProtectedRoute element={<MonitoringDashboard />} requiredRoles={['admin', 'user']} />} />
            <Route path="/topics-queues" element={<ProtectedRoute element={<TopicsQueues />} requiredRoles={['admin', 'user']} />} />
            <Route path="/docs" element={<ProtectedRoute element={<Documentation />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
