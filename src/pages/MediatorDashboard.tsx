
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import Layout from '@/components/layout/Layout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Plus, ListFilter, ShipIcon, RefreshCw } from 'lucide-react';
// import { toast } from 'sonner';
// import { supabase } from '@/lib/supabase';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import ListingForm from '@/components/ui-custom/ListingForm';

// const MediatorDashboard = () => {
//   // const { user } = useAuth();
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const [listings, setListings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);




//   useEffect(() => {
//     if (!user) {
//       console.log("User is null, waiting for AuthContext to provide session...");
//       return; // Wait until AuthContext provides the user
//     }

//     console.log("User from AuthContext:", user);
//     fetchMediatorListings(user); // Fetch listings only after user is available

//     const channel = supabase
//       .channel('listings')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
//         console.log('Change detected:', payload);
//         fetchMediatorListings(user); // Ensure fresh data is fetched
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [user, refreshTrigger]); // Depend on user and refreshTrigger




//   const fetchMediatorListings = async (user) => {

//     console.log("check if user exists - ", user)
//     if (!user) return;

//     // setIsLoading(true);
//     try {
//       console.log('Mediator Dashboard: Fetching listings for mediator ID:', user.id);

//       const { data, error } = await supabase
//         .from('listings')
//         .select('*', { head: false })
//         .eq('mediator_id', user.id);

//       if (error) {
//         console.error('Supabase error details:', error);
//         throw error;
//       }

//       console.log('Mediator Dashboard: Listings fetched successfully:', data);
//       setListings(data || []);
//     } catch (error) {
//       console.error('Error fetching mediator listings:', error);
//       toast.error('Failed to fetch your listings');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const refreshListings = () => {
//   //   setRefreshTrigger(prev => prev + 1);
//   //   console.log('Mediator Dashboard: Refreshing listings');
//   //   // fetchMediatorListings();
//   //   toast.info('Refreshing listings...');
//   // };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 text-green-800';
//       case 'rejected':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-yellow-100 text-yellow-800';
//     }
//   };

//   const handleCreateListing = () => {
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     // refreshListings(); // Refresh listings after form is closed
//   };

//   return (
//     <Layout>
//       <div className="container py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Mediator Dashboard</h1>
//           <div className="flex space-x-2">
//             {/* <Button variant="outline" onClick={refreshListings}>
//               <RefreshCw className="mr-2 h-4 w-4" />
//               Refresh
//             </Button> */}
//             <Button onClick={handleCreateListing}>
//               <Plus className="mr-2 h-4 w-4" />
//               Create New Listing
//             </Button>
//           </div>
//         </div>

//         <Tabs defaultValue="myListings" className="w-full">
//           <TabsList className="mb-6">
//             <TabsTrigger value="myListings">
//               <ListFilter className="mr-2 h-4 w-4" />
//               My Listings
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="myListings">
//             <Card>
//               <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
//                 <div>
//                   <CardTitle>My Listings</CardTitle>
//                   <CardDescription>
//                     Manage your shipping listings
//                   </CardDescription>
//                 </div>
//                 {user && (
//                   <div className="mt-4 sm:mt-0">
//                     <div className="text-sm text-muted-foreground">
//                       Mediator ID: <span className="font-mono text-xs">{user.id}</span>
//                     </div>
//                   </div>
//                 )}
//               </CardHeader>
//               <CardContent>
//                 {isLoading ? (
//                   <div className="flex items-center justify-center h-32">
//                     <p className="text-lg">Loading...</p>
//                   </div>
//                 ) : listings.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="text-left py-3 px-4">Title</th>
//                           <th className="text-left py-3 px-4">Route</th>
//                           <th className="text-left py-3 px-4">Departure</th>
//                           <th className="text-left py-3 px-4">Delivery</th>
//                           <th className="text-left py-3 px-4">Status</th>
//                           <th className="text-right py-3 px-4">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {listings.map((listing) => (
//                           <tr key={listing.id} className="border-b hover:bg-muted/50">
//                             <td className="py-3 px-4">{listing.title}</td>
//                             <td className="py-3 px-4">
//                               {listing.route_origin} to {listing.route_destination}
//                             </td>
//                             <td className="py-3 px-4">
//                               {new Date(listing.departure_date).toLocaleDateString()}
//                             </td>
//                             <td className="py-3 px-4">
//                               {new Date(listing.delivery_date).toLocaleDateString()}
//                             </td>
//                             <td className="py-3 px-4">
//                               <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(listing.status)}`}>
//                                 {listing.status}
//                               </span>
//                             </td>
//                             <td className="py-3 px-4 text-right">
//                               <Button variant="outline" size="sm">View</Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-32 space-y-4">
//                     <ShipIcon className="h-10 w-10 text-gray-400" />
//                     <p className="text-center text-gray-500">You haven't created any listings yet</p>
//                     <Button onClick={handleCreateListing}>Create Your First Listing</Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Create New Listing</DialogTitle>
//               <DialogDescription>
//                 Fill in the details to create a new shipping listing.
//                 Your listing will be pending until approved by an admin.
//               </DialogDescription>
//             </DialogHeader>
//             <ListingForm onClose={handleDialogClose} />
//           </DialogContent>
//         </Dialog>
//       </div>
//     </Layout>
//   );
// };

// export default MediatorDashboard;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter, ShipIcon, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ListingForm from '@/components/ui-custom/ListingForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MediatorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!user) {
      console.log("User is null, waiting for AuthContext to provide session...");
      return; // Wait until AuthContext provides the user
    }

    console.log("User from AuthContext:", user);
    fetchMediatorListings(user); // Fetch listings only after user is available

    const channel = supabase
      .channel('listings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
        console.log('Change detected:', payload);
        fetchMediatorListings(user); // Ensure fresh data is fetched
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshTrigger]); // Depend on user and refreshTrigger

  const fetchMediatorListings = async (user) => {
    console.log("check if user exists - ", user)
    if (!user) return;

    try {
      console.log('Mediator Dashboard: Fetching listings for mediator ID:', user.id);

      const { data, error } = await supabase
        .from('listings')
        .select('*', { head: false })
        .eq('mediator_id', user.id);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Mediator Dashboard: Listings fetched successfully:', data);
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
    console.log('Mediator Dashboard: Refreshing listings');
    toast.info('Refreshing listings...');
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

  // Handle sorting logic
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Apply sorting to listings
  const sortedListings = [...listings].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    if (sortField === 'departure_date' || sortField === 'delivery_date') {
      valueA = new Date(a[sortField]).getTime();
      valueB = new Date(b[sortField]).getTime();
    } else if (sortField === 'status') {
      // Custom sorting for status
      const statusOrder = { approved: 0, pending: 1, rejected: 2 };
      valueA = statusOrder[a[sortField]] || 999;
      valueB = statusOrder[b[sortField]] || 999;
    } else {
      valueA = a[sortField];
      valueB = b[sortField];
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Apply pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = sortedListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedListings.length / itemsPerPage);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mediator Dashboard</h1>
          <div className="flex space-x-2">
            {/* <Button variant="outline" onClick={refreshListings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button> */}
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
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort('title')}
                                className="flex items-center gap-1 font-medium"
                              >
                                Title
                                {sortField === 'title' && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort('route_origin')}
                                className="flex items-center gap-1 font-medium"
                              >
                                Route
                                {sortField === 'route_origin' && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort('departure_date')}
                                className="flex items-center gap-1 font-medium"
                              >
                                Departure
                                {sortField === 'departure_date' && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort('delivery_date')}
                                className="flex items-center gap-1 font-medium"
                              >
                                Delivery
                                {sortField === 'delivery_date' && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort('price_per_ton')}
                                className="flex items-center gap-1 font-medium"
                              >
                                Price(per ton)
                                {sortField === 'price_per_ton' && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort('status')}
                                className="flex items-center gap-1 font-medium"
                              >
                                Status
                                {sortField === 'status' && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableHead>
                            {/* <TableHead className="text-right">Actions</TableHead> */}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentListings.map((listing) => (
                            <TableRow key={listing.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{listing.title}</TableCell>
                              <TableCell>{listing.route_origin} to {listing.route_destination}</TableCell>
                              <TableCell>{formatDate(listing.departure_date)}</TableCell>
                              <TableCell>{formatDate(listing.delivery_date)}</TableCell>
                              <TableCell className=''>{listing.price_per_ton}$</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(listing.status)}`}>
                                  {listing.status}
                                </span>
                              </TableCell>

                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center pt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, listings.length)} of {listings.length} listings
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous Page</span>
                          </Button>
                          <div className="text-sm">
                            Page {currentPage} of {totalPages}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next Page</span>
                          </Button>
                        </div>
                      </div>
                    )}
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