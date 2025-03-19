
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter, ShipIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ListingForm from '@/components/ui-custom/ListingForm';

const MediatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'mediator') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    fetchMediatorListings();
  }, [user, navigate, refreshTrigger]);

  const fetchMediatorListings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching listings for mediator ID:', user.id);
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('mediator_id', user.id);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Listings fetched successfully:', data);
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching mediator listings:', error);
      toast.error('Failed to fetch your listings');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshListings = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleCreateListing = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    refreshListings(); // Refresh listings after form is closed
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mediator Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={refreshListings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleCreateListing}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Listing
            </Button>
          </div>
        </div>

        <Tabs defaultValue="myListings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="myListings">
              <ListFilter className="mr-2 h-4 w-4" />
              My Listings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myListings">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>
                    Manage your shipping listings
                  </CardDescription>
                </div>
                {user && (
                  <div className="mt-4 sm:mt-0">
                    <div className="text-sm text-muted-foreground">
                      Mediator ID: <span className="font-mono text-xs">{user.id}</span>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-lg">Loading...</p>
                  </div>
                ) : listings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Title</th>
                          <th className="text-left py-3 px-4">Route</th>
                          <th className="text-left py-3 px-4">Departure</th>
                          <th className="text-left py-3 px-4">Delivery</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listings.map((listing) => (
                          <tr key={listing.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{listing.title}</td>
                            <td className="py-3 px-4">
                              {listing.route_origin} to {listing.route_destination}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(listing.departure_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(listing.delivery_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(listing.status)}`}>
                                {listing.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="outline" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 space-y-4">
                    <ShipIcon className="h-10 w-10 text-gray-400" />
                    <p className="text-center text-gray-500">You haven't created any listings yet</p>
                    <Button onClick={handleCreateListing}>Create Your First Listing</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new shipping listing. 
                Your listing will be pending until approved by an admin.
              </DialogDescription>
            </DialogHeader>
            <ListingForm onClose={handleDialogClose} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MediatorDashboard;
