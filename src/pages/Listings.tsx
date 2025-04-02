
// import React, { useEffect, useState } from 'react';
// import Layout from '@/components/layout/Layout';
// import SearchForm from '@/components/ui-custom/SearchForm';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Ship } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
// import { SearchFilters } from '@/types';
// import { toast } from 'sonner';
// import { supabase } from '@/lib/supabase';

// const Listings = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

//   // Parse query parameters for initial search filters
//   const initialFilters: SearchFilters = {
//     departure: queryParams.get('departure') || undefined,
//     destination: queryParams.get('destination') || undefined,
//     departureDate: queryParams.get('departureDate')
//       ? new Date(queryParams.get('departureDate') as string)
//       : undefined,
//     deliveryDate: queryParams.get('deliveryDate')
//       ? new Date(queryParams.get('deliveryDate') as string)
//       : undefined
//   };

//   const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialFilters);
//   const [isLoading, setIsLoading] = useState(false);
//   const [listings, setListings] = useState<any[]>([]);

//   useEffect(() => {
//     // Only search if there are initial filters
//     if (Object.values(initialFilters).some(value => value !== undefined)) {
//       handleSearchSubmit(initialFilters);
//     }
//   }, []);

//   const handleSearchSubmit = async (filters: SearchFilters) => {
//     setIsLoading(true);
//     setSearchFilters(filters);
//     // This will be expanded to fetch listings based on filters

//     try {
//       let query = supabase
//         .from('listings')
//         .select('*');

//       // Add filter conditions if they exist
//       if (filters.departure) {
//         query = query.ilike('route_origin', `%${filters.departure}%`);
//       }

//       if (filters.destination) {
//         query = query.ilike('route_destination', `%${filters.destination}%`);
//       }

//       if (filters.departureDate) {
//         query = query.gte('departure_date', filters.departureDate.toISOString());
//       }

//       if (filters.deliveryDate) {
//         query = query.lte('delivery_date', filters.deliveryDate.toISOString());
//       }

//       const { data, error } = await query;


//       if (error) {
//         console.error('Error fetching listings:', error);
//         throw error;
//       }

//       setListings(data || []);
//       console.log('Listings fetched successfully:  ', data);
//     } catch (error) {
//       console.error('Error fetching listings:', error);
//       toast.error('Failed to fetch listings. Please try again.');
//     } finally {
//       // console.log('Listings fetched successfully' + listings);
//       setIsLoading(false);
//     }

//   };

//   return (
//     <Layout>
//       <div className="container py-8">
//         <h1 className="text-3xl font-bold mb-6">Available Shipping Listings</h1>

//         <div className="mb-8">
//           <SearchForm
//             initialFilters={searchFilters}
//             onSubmit={handleSearchSubmit}
//           />
//         </div>

//         {/* Results section */}
//         <div className="grid gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Search Results</CardTitle>
//             </CardHeader>

//             <CardContent>
//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <p className="text-muted-foreground">Loading...</p>
//                 </div>
//               ) : listings.length > 0 ? (
//                 <div className="space-y-4">
//                   <p className="text-muted-foreground">Found {listings.length} listings</p>
//                   {listings.map((listing) => (
//                     <Card key={listing.id}>
//                       <CardContent className="p-4">
//                         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                           <div>
//                             <p className="text-sm font-medium">Departure</p>
//                             <p className="text-muted-foreground">{listing.route_origin}</p>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium">Destination</p>
//                             <p className="text-muted-foreground">{listing.route_destination}</p>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium">Departure Date</p>
//                             <p className="text-muted-foreground">
//                               {new Date(listing.departure_date).toLocaleDateString('en-US', {
//                                 day: '2-digit',
//                                 month: 'long',
//                                 year: 'numeric'
//                               })}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium">Delivery Date</p>
//                             <p className="text-muted-foreground">
//                               {new Date(listing.delivery_date).toLocaleDateString('en-US', {
//                                 day: '2-digit',
//                                 month: 'long',
//                                 year: 'numeric'
//                               })}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium">Price(per ton)</p>
//                             <p className="text-muted-foreground">{listing.price_per_ton}</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ) : searchFilters.departure || searchFilters.destination ? (
//                 <div className="text-center py-12">
//                   <p className="text-muted-foreground">
//                     No listings found matching your search criteria.
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     Try adjusting your search filters or check back later.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-12 space-y-3">
//                   <Ship className="h-16 w-16 text-primary/30" />
//                   <p className="text-xl font-medium">Find available shipping routes</p>
//                   <p className="text-muted-foreground">
//                     Use the search form above to find available shipping routes
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Listings;

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/ui-custom/SearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, ArrowUpDown, ChevronLeft, ChevronRight, Building, MapPin, X, Mail, Link } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { SearchFilters } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogClose } from '@radix-ui/react-dialog';

const Listings = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Parse query parameters for initial search filters
  const initialFilters: SearchFilters = {
    departure: queryParams.get('departure') || undefined,
    destination: queryParams.get('destination') || undefined,
    departureDate: queryParams.get('departureDate')
      ? new Date(queryParams.get('departureDate') as string)
      : undefined,
    deliveryDate: queryParams.get('deliveryDate')
      ? new Date(queryParams.get('deliveryDate') as string)
      : undefined
  };

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState<any>(null);
  const [loadingMediator, setLoadingMediator] = useState(false);

  useEffect(() => {
    // Only search if there are initial filters
    if (Object.values(initialFilters).some(value => value !== undefined)) {
      handleSearchSubmit(initialFilters);
    }
  }, []);

  const handleSearchSubmit = async (filters: SearchFilters) => {
    setIsLoading(true);
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to first page on new search

    try {
      let query = supabase
        .from('listings')
        .select('*');

      // Add filter conditions if they exist
      if (filters.departure) {
        query = query.ilike('route_origin', `%${filters.departure}%`);
      }

      if (filters.destination) {
        query = query.ilike('route_destination', `%${filters.destination}%`);
      }

      if (filters.departureDate) {
        query = query.gte('departure_date', filters.departureDate.toISOString());
      }

      if (filters.deliveryDate) {
        query = query.lte('delivery_date', filters.deliveryDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      setListings(data || []);
      console.log('Listings fetched successfully:', data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch mediator details
  const fetchMediatorDetails = async (mediatorId: string) => {
    setLoadingMediator(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mediatorId)
        .single();

      if (error) {
        console.error('Error fetching mediator details:', error);
        toast.error('Failed to load mediator profile.');
        throw error;
      }

      setSelectedMediator(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingMediator(false);
    }
  };

  // Handle view button click
  const handleViewMediator = (listing: any) => {
    if (listing.mediator_id) {
      fetchMediatorDetails(listing.mediator_id);
    } else {
      toast.error('Mediator information not available for this listing.');
    }
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

  // Apply sorting to listings
  const sortedListings = [...listings].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    if (sortField === 'departure_date' || sortField === 'delivery_date') {
      valueA = new Date(a[sortField]).getTime();
      valueB = new Date(b[sortField]).getTime();
    } else if (sortField === 'price_per_ton') {
      valueA = parseFloat(a[sortField]);
      valueB = parseFloat(b[sortField]);
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Available Shipping Listings</h1>

        <div className="mb-8">
          <SearchForm
            initialFilters={searchFilters}
            onSubmit={handleSearchSubmit}
          />
        </div>

        {/* Results section */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : listings.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Found {listings.length} listings</p>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('route_origin')}
                              className="flex items-center gap-1 font-medium"
                            >
                              Departure
                              {sortField === 'route_origin' && (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="w-[200px]">
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('route_destination')}
                              className="flex items-center gap-1 font-medium"
                            >
                              Destination
                              {sortField === 'route_destination' && (
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
                              Departure Date
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
                              Delivery Date
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
                              Price (per ton)
                              {sortField === 'price_per_ton' && (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell className="font-medium">{listing.route_origin}</TableCell>
                            <TableCell>{listing.route_destination}</TableCell>
                            <TableCell>{formatDate(listing.departure_date)}</TableCell>
                            <TableCell>{formatDate(listing.delivery_date)}</TableCell>
                            <TableCell>{listing.price_per_ton}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm"
                                onClick={() => handleViewMediator(listing)}
                                disabled={loadingMediator}>{loadingMediator ? "Loading..." : "View"}
                              </Button>

                              <NavLink to={`/listings/${listing.id}`} className="flex-1">
                                <Button
                                  variant="outline" size="sm"
                                  // className="w-full border-ship-600 text-ship-600 hover:bg-ship-50"
                                  disabled={loadingMediator}
                                >
                                  {loadingMediator ? "Loading..." : "View Details"}

                                </Button>
                              </NavLink>

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
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, listings.length)} of {listings.length} entries
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
              ) : searchFilters.departure || searchFilters.destination ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No listings found matching your search criteria.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search filters or check back later.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Ship className="h-16 w-16 text-primary/30" />
                  <p className="text-xl font-medium">Find available shipping routes</p>
                  <p className="text-muted-foreground">
                    Use the search form above to find available shipping routes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Mediator Modal */}
      {selectedMediator ? (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mediator Details</DialogTitle>
              <DialogDescription>
                Information about the mediator handling this listing.
              </DialogDescription>
            </DialogHeader>
            {selectedMediator ? (
              <div className="space-y-2">
                {/* <p><strong>Email:</strong> {selectedMediator.email}</p> */}

                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{selectedMediator.company_name}</p>
                  </div>
                </div>

                {/* <p><strong>Company:</strong> {selectedMediator.company_name}</p> */}

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{selectedMediator.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{selectedMediator.company_address}</p>
                  </div>
                </div>
                {/* <p><strong>Location:</strong> {selectedMediator.company_address}</p> */}
              </div>
            ) : (
              <p className="text-muted-foreground">Loading mediator details...</p>
            )}
          </DialogContent>
        </Dialog>
      ) : <div className="text-center py-4">
        <p className="text-muted-foreground">No mediator information available</p>
      </div>}

      {/* 
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mediator Profile</DialogTitle>
            <DialogDescription>
              Contact details for the shipping mediator
            </DialogDescription>
          </DialogHeader>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="py-4">
            {selectedMediator ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{selectedMediator.company_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{selectedMediator.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{selectedMediator.company_address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No mediator information available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog> */}


    </Layout>
  );
};

export default Listings;