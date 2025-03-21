
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  CheckCircle, 
  XCircle, 
  Users, 
  Ship, 
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Admin Dashboard: Fetching all listings from Supabase...');
        
        // Fetch all listings - using the correct supabase client
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*');

        if (listingsError) {
          console.error('Error fetching listings:', listingsError);
          throw listingsError;
        }
        
        console.log('Admin Dashboard: Fetched listings:', listingsData);
        const allListings = listingsData || [];
        setListings(allListings);
        
        // Filter pending listings
        const pending = allListings.filter(listing => listing.status === 'pending');
        console.log('Admin Dashboard: Pending listings:', pending);
        setPendingListings(pending);

        // Fetch users from the profiles table instead of users table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        
        console.log('Admin Dashboard: Fetched profiles:', profilesData);
        setUsers(profilesData || []);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.info('Refreshing data...');
  };

  const handleApproveListing = async (id) => {
    try {
      setLoading(true);
      console.log('Approving listing with ID:', id);
      
      const { error } = await supabase
        .from('listings')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) {
        console.error('Error approving listing:', error);
        throw error;
      }
      
      toast.success('Listing approved');
      
      // Trigger a refresh to update the listings
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error approving listing:', error);
      toast.error('Failed to approve listing');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectListing = async (id) => {
    try {
      setLoading(true);
      console.log('Rejecting listing with ID:', id);
      
      const { error } = await supabase
        .from('listings')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) {
        console.error('Error rejecting listing:', error);
        throw error;
      }
      
      toast.success('Listing rejected');
      
      // Trigger a refresh to update the listings
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error rejecting listing:', error);
      toast.error('Failed to reject listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-lg">Loading data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue={pendingListings.length > 0 ? "pending" : "overview"} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pending">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Pending Approval
              {pendingListings.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingListings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="listings">
              <Ship className="mr-2 h-4 w-4" />
              All Listings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Users registered on the platform
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{listings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Shipping listings created
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingListings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Listings awaiting your approval
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Listings</CardTitle>
                <CardDescription>
                  Review and approve or reject new shipping listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingListings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Mediator</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Price/Ton</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingListings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium">{listing.title}</TableCell>
                          <TableCell>{listing.mediator_name}</TableCell>
                          <TableCell>
                            {listing.route_origin} to {listing.route_destination}
                          </TableCell>
                          <TableCell>
                            {new Date(listing.departure_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${listing.price_per_ton}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                              onClick={() => handleApproveListing(listing.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                              onClick={() => handleRejectListing(listing.id)}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="text-xl font-medium">No pending listings</p>
                    <p className="text-muted-foreground">All listings have been reviewed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users registered on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>{user.role || 'customer'}</TableCell>
                          <TableCell>{user.company || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Listings Management</CardTitle>
                <CardDescription>
                  Manage all shipping listings on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {listings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Mediator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price/Ton</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium">{listing.title}</TableCell>
                          <TableCell>{listing.mediator_name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              listing.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : listing.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {listing.status}
                            </span>
                          </TableCell>
                          <TableCell>${listing.price_per_ton}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4">No listings found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
