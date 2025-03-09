
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<void>;
  updateUserProfile: (updatedUser: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock users for demo purposes
const MOCK_USERS = [
  { 
    id: '1', 
    username: 'admin', 
    email: 'admin@example.com', 
    password: 'admin123', 
    role: 'admin' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' 
  },
  { 
    id: '2', 
    username: 'user', 
    email: 'user@example.com', 
    password: 'user123', 
    role: 'user' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user' 
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth on mount
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${foundUser.username}!`);
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast.error('User with this email already exists');
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    // In a real app, you'd make an API call to create the user
    const newUser = {
      id: String(Date.now()),
      username,
      email,
      role: 'user' as const,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success('Account created successfully!');
    
    setIsLoading(false);
  };

  const updateUserProfile = async (updatedUser: Partial<User>) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      // Create updated user object
      const newUserData = { ...user, ...updatedUser };
      
      // Update state and localStorage
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      // Generate new avatar if username changed and no custom avatar provided
      if (updatedUser.username && !updatedUser.avatar && !user.avatar?.startsWith('data:')) {
        const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updatedUser.username}`;
        setUser(prev => {
          if (prev) {
            const updatedUserWithAvatar = { ...prev, avatar: newAvatarUrl };
            localStorage.setItem('user', JSON.stringify(updatedUserWithAvatar));
            return updatedUserWithAvatar;
          }
          return prev;
        });
      }
      
      toast.success('Profile updated successfully!');
    } else {
      toast.error('No user found to update');
      throw new Error('No user found');
    }
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
