
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
import Listings from "./pages/Listings";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "sonner";
import AdminLogin from "./pages/AdminLogin";
import ListingDetails from "./components/ui-custom/ListingDetails";
import BookingPage from "./components/ui-custom/BookingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);

  useEffect(() => {
    // Test Supabase connection
    const checkSupabaseConnection = async () => {
      try {
        console.log('Checking Supabase connection...');
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "relation does not exist" which is expected if the table doesn't exist
          console.error('Supabase connection error:', error);
          toast.error('Failed to connect to Supabase');
        } else {
          console.log('Successfully connected to Supabase');
          toast.success('Connected to Supabase');
          setSupabaseInitialized(true);

          // Check listings table exists
          try {
            const { data: listingsData, error: listingsError } = await supabase
              .from('listings')
              .select('count')
              .limit(1);

            if (listingsError && listingsError.code !== 'PGRST116') {
              console.error('Error checking listings table:', listingsError);
            } else {
              console.log('Listings table check:', listingsData);
            }
          } catch (listingsError) {
            console.error('Error checking listings table:', listingsError);
          }

          // Check for admin user instead of trying to create one
          try {
            const { data: adminCheck, error: adminCheckError } = await supabase
              .from('profiles')
              .select('*')
              .eq('role', 'admin')
              .limit(1);

            if (adminCheckError) {
              console.error('Failed to check for admin user:', adminCheckError);
            } else if (adminCheck && adminCheck.length > 0) {
              console.log('Admin user exists');
            } else {
              console.log('No admin user found - please create one using SQL');
            }
          } catch (adminError) {
            console.error('Error checking admin user:', adminError);
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
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/mediator" element={<MediatorDashboard />} />
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
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
