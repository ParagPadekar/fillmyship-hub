
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

    // No need to redirect admin to a different page,
    // just use the role-specific dashboard routes for customer and mediator
    switch (user.role) {
      case 'mediator':
        navigate('/mediator');
        break;
      case 'customer':
        navigate('/customer');
        break;
      // For admin, we'll stay on this component and render the admin dashboard
      // This way, Dashboard and Admin Panel can be different pages
    }
  }, [user, isLoading, navigate]);

  // If we're an admin and we didn't redirect, show loading or redirect manually
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading your dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }

  // If user is admin, we can either show the admin dashboard here or redirect to admin page
  if (user && user.role === 'admin') {
    navigate('/admin');
    return null;
  }

  // This should typically not be shown as we either redirect or show loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Redirecting to your dashboard...</h2>
        <p className="text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
};

export default Dashboard;
