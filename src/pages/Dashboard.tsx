
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      toast.error('Please login to access the dashboard');
      navigate('/login');
      return;
    }

    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'mediator':
        navigate('/mediator');
        break;
      default:
        // For customers or any other role
        navigate('/customer');
        break;
    }
  }, [user, isLoading, navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading your dashboard...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you</p>
      </div>
    </div>
  );
};

export default Dashboard;
