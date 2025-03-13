
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, CheckCircle, XCircle, Users, Ship, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Fetch all listings
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*');

        if (listingsError) throw listingsError;
        const allListings = listingsData || [];
        setListings(allListings);
        
        // Filter pending listings
        const pending = allListings.filter(listing => listing.status === 'pending');
        setPendingListings(pending);

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*');

        if (usersError) throw usersError;
        setUsers(usersData || []);

      } catch (error) {
        toast.error('Failed to fetch data');
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleApproveListing = async (id) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Listing approved');
      
      // Update local state
      setListings(prev => 
        prev.map(listing => 
          listing.id === id ? { ...listing, status: 'approved' } : listing
        )
      );
      
      setPendingListings(prev => prev.filter(listing => listing.id !== id));
    } catch (error) {
      toast.error('Failed to approve listing');
      console.error('Error approving listing:', error);
    }
  };

  const handleRejectListing = async (id) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Listing rejected');
      
      // Update local state
      setListings(prev => 
        prev.map(listing => 
          listing.id === id ? { ...listing, status: 'rejected' } : listing
        )
      );
      
      setPendingListings(prev => prev.filter(listing => listing.id !== id));
    } catch (error) {
      toast.error('Failed to reject listing');
      console.error('Error rejecting listing:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Loading...</p>
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Title</th>
                          <th className="text-left py-3 px-4">Mediator</th>
                          <th className="text-left py-3 px-4">Route</th>
                          <th className="text-left py-3 px-4">Departure</th>
                          <th className="text-left py-3 px-4">Price/Ton</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingListings.map((listing) => (
                          <tr key={listing.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{listing.title}</td>
                            <td className="py-3 px-4">{listing.mediator_name}</td>
                            <td className="py-3 px-4">
                              {listing.route_origin} to {listing.route_destination}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(listing.departure_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">${listing.price_per_ton}</td>
                            <td className="py-3 px-4 text-right space-x-2">
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Username</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Role</th>
                          <th className="text-left py-3 px-4">Company</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.username}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">{user.role || 'customer'}</td>
                            <td className="py-3 px-4">{user.company || '-'}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="outline" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Title</th>
                          <th className="text-left py-3 px-4">Mediator</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Price/Ton</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map((listing) => (
                          <tr key={listing.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{listing.title}</td>
                            <td className="py-3 px-4">{listing.mediator_name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                listing.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : listing.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {listing.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">${listing.price_per_ton}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="outline" size="sm" className="mr-2">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
