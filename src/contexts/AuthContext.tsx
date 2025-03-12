
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from '@/components/ui/sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored JWT token
    const token = localStorage.getItem('fillmyship.token');
    if (token) {
      // For demo purposes, we'll decode the token and set user
      // In a real app, you'd verify this with your backend
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        if (payload.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('fillmyship.token');
          setUser(null);
        } else {
          setUser({
            id: payload.sub,
            username: payload.username,
            email: payload.email,
            role: payload.role,
            createdAt: new Date(payload.iat * 1000),
            company: payload.company,
          });
        }
      } catch (err) {
        localStorage.removeItem('fillmyship.token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you'd make an API call to your auth endpoint
      // For demo purposes, we'll use mock data
      const mockUsers = [
        { id: 'user1', username: 'johnbuyer', email: 'john@example.com', role: 'user', createdAt: new Date(), company: 'Cargo Inc.' },
        { id: 'mediator1', username: 'sarahship', email: 'sarah@example.com', role: 'mediator', createdAt: new Date(), company: 'Ship Co.' },
        { id: 'admin1', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: new Date() }
      ];
      
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      // Create mock JWT token
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      };
      
      const base64Encode = (str: string) => {
        return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      };
      
      const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const encodedPayload = base64Encode(JSON.stringify(payload));
      const signature = base64Encode('mockSignature'); // In a real app, this would be a proper signature
      
      const token = `${header}.${encodedPayload}.${signature}`;
      
      localStorage.setItem('fillmyship.token', token);
      setUser(user as User);
      toast.success('Logged in successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string, role: 'user' | 'mediator') => {
    setIsLoading(true);
    try {
      // In a real app, you'd make an API call to register the user
      // For demo purposes, we'll simulate successful registration
      const newUser = {
        id: `user${Date.now()}`,
        username,
        email,
        role,
        createdAt: new Date(),
      };
      
      // Create mock JWT token
      const payload = {
        sub: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      };
      
      const base64Encode = (str: string) => {
        return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      };
      
      const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const encodedPayload = base64Encode(JSON.stringify(payload));
      const signature = base64Encode('mockSignature'); // In a real app, this would be a proper signature
      
      const token = `${header}.${encodedPayload}.${signature}`;
      
      localStorage.setItem('fillmyship.token', token);
      setUser(newUser as User);
      toast.success('Account created successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fillmyship.token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
