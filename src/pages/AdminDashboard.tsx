
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, ChevronDown, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
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
        // Fetch listings
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*');

        if (listingsError) throw listingsError;
        setListings(listingsData || []);

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*');

        if (usersError) throw usersError;
        setUsers(usersData || []);

      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="listings">
              <ChevronDown className="mr-2 h-4 w-4" />
              Listings
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
            </div>
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
                        {users.map((user: any) => (
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
                        {listings.map((listing: any) => (
                          <tr key={listing.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{listing.title}</td>
                            <td className="py-3 px-4">{listing.mediatorName}</td>
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
                            <td className="py-3 px-4">
                              {listing.pricePerTon} {listing.currency}
                            </td>
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
