
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { User, AuthContextType } from '@/types';
// import { toast } from 'sonner';
// import { supabase } from '@/lib/supabase';
// import { Session } from '@supabase/supabase-js';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   console.log("AuthContext: Called useAuth returning context: ", context)
//   return context;
// };

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     // Check current session
//     const initializeAuth = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setSession(session);

//       if (session) {
//         // Fetch user profile data
//         const { data: profile } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', session.user.id)
//           .single();

//         setUser({
//           id: session.user.id,
//           username: profile?.username || session.user.email?.split('@')[0] || '',
//           email: session.user.email || '',
//           role: session.user.user_metadata.role || 'customer',
//           createdAt: new Date(session.user.created_at),
//           company: profile?.company || session.user.user_metadata.company,
//         });
//       }

//       setIsLoading(false);
//     };

//     initializeAuth();

//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         console.log("AuthContext: session ", session)
//         setSession(session);
//         setIsLoading(true);

//         if (session) {
//           // Fetch user profile data
//           const { data: profile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single();

//           setUser({
//             id: session.user.id,
//             username: profile?.username || session.user.email?.split('@')[0] || '',
//             email: session.user.email || '',
//             // Try to get role from profile first, then from user metadata as fallback
//             role: profile?.role || session.user.user_metadata.role || 'customer',
//             createdAt: new Date(session.user.created_at),
//             company: profile?.company || session.user.user_metadata.company,
//           });
//         } else {
//           setUser(null);
//         }

//         setIsLoading(false);
//       }
//     );

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       toast.success('Logged in successfully');
//       return data;
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to login');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signup = async (username: string, email: string, password: string, role: 'customer' | 'mediator' | 'admin') => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             username,
//             role,
//           },
//         },
//       });

//       if (error) throw error;

//       toast.success('Signup successful. Please check your email to confirm your account.');
//       return data;
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to create account');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       console.log(error);
//       if (error) {
//         toast.error(error.message || 'Failed to logout');
//         throw error;
//       }

//       setUser(null);
//       toast.success('Logged out successfully');
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to logout');
//     }
//   };

//   const value = {
//     user,
//     isLoading,
//     login,
//     signup,
//     logout,
//     session
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };








// *********************** *                **   **  NEW CODE

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure this imports your supabase instance
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Session } from 'inspector/promises';
import { useNavigate } from 'react-router-dom';

// Define the shape of the context
interface AuthContextType {
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  user: any; // Adjust the type depending on your user object
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null); // User state can be typed more specifically based on your needs
  const [loading, setLoading] = useState(true); // Track loading state

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSession = async () => {
      setLoading(true);

      // Get the session from Supabase
      const { data, error } = await supabase.auth.getSession();

      // Handle session error if any
      if (error) {
        console.error('Error fetching session:', error);
      }

      // If session exists, set user
      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // Fetch session on mount
    fetchUserSession();

    // Subscribe to auth state changes (in case session expires or user logs in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user || null);
    });

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // end use effect

  const signup = async (username: string, email: string, password: string, role: 'customer' | 'mediator' | 'admin',
    company_name: string,
    company_address: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
            company_name,
            company_address
          },
        },
      });

      if (error) throw error;

      // Then create the profile record
      // console.log("user registered success- ", data);
      // const { error: profileError } = await supabase
      //   .from('profiles')
      //   .update({
      //     company_name: data.user.user_metadata.companyName,
      //     company_address: data.user.user_metadata.companyAddress,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', data.user!.id);
      // if (profileError) throw profileError;

      toast.success('Signup successful. Please check your email to confirm your account.');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log(error);
      if (error) {
        toast.error(error.message || 'Failed to logout');
        throw error;
      }

      setUser(null);
      toast.success('Logged out successfully');


    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext in your components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
