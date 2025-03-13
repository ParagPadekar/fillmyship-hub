
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Package, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Optional: Check if user has customer role, but anyone can be a customer by default
    if (user.role !== 'customer' && user.role !== 'admin' && user.role !== 'mediator') {
      toast.error('Unauthorized access');
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <UserCircle className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Package className="mr-2 h-4 w-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="listings">
              <ClipboardList className="mr-2 h-4 w-4" />
              Available Listings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {user?.username}!</CardTitle>
                <CardDescription>
                  Here's your shipping activity overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Package className="h-16 w-16 text-primary/30" />
                  <p className="text-xl font-medium">No recent shipping activity</p>
                  <p className="text-muted-foreground">Browse available listings to book your first shipment</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>
                  Track and manage your shipping bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Package className="h-16 w-16 text-primary/30" />
                  <p className="text-xl font-medium">No bookings yet</p>
                  <p className="text-muted-foreground">You haven't made any shipping bookings yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Available Listings</CardTitle>
                <CardDescription>
                  Find and book available shipping routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4">Loading available listings...</p>
                {/* This will be populated with real listings data in the future */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
