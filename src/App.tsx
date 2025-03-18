
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MediatorDashboard from "./pages/MediatorDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);

  useEffect(() => {
    // Test Supabase connection
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "relation does not exist" which is expected if the table doesn't exist
          console.error('Supabase connection error:', error);
          toast.error('Failed to connect to Supabase');
        } else {
          console.log('Successfully connected to Supabase');
          toast.success('Connected to Supabase');
          setSupabaseInitialized(true);
          
          // Create admin user
          try {
            const { data: adminData, error: adminError } = await supabase.functions.invoke('create-admin');
            if (adminError) {
              console.error('Failed to create admin user:', adminError);
            } else {
              console.log('Admin user info:', adminData);
            }
          } catch (adminError) {
            console.error('Error invoking create-admin function:', adminError);
          }
        }
      } catch (error) {
        console.error('Supabase initialization error:', error);
        toast.error('Failed to initialize Supabase connection');
      }
    };

    checkSupabaseConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/mediator" element={<MediatorDashboard />} />
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
