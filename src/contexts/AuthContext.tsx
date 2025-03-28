
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

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
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setIsLoading(true);
        
        if (session) {
          // Fetch user profile data
          const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', session.user.id)
  .single();

setUser({
  id: session.user.id,
  username: profile?.username || session.user.email?.split('@')[0] || '',
  email: session.user.email || '',
  // Try to get role from profile first, then from user metadata as fallback
  role: profile?.role || session.user.user_metadata.role || 'customer',
  createdAt: new Date(session.user.created_at),
  company: profile?.company || session.user.user_metadata.company,
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check current session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Fetch user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          id: session.user.id,
          username: profile?.username || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          role: session.user.user_metadata.role || 'customer',
          createdAt: new Date(session.user.created_at),
          company: profile?.company || session.user.user_metadata.company,
        });
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Logged in successfully');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string, role: 'customer' | 'mediator' | 'admin') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
          },
        },
      });
  
      if (error) throw error;
      
      toast.success('Signup successful. Please check your email to confirm your account.');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
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
