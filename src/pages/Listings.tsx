
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/ui-custom/SearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SearchFilters } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    // Only search if there are initial filters
    if (Object.values(initialFilters).some(value => value !== undefined)) {
      handleSearchSubmit(initialFilters);
    }
  }, []);

  const handleSearchSubmit = async (filters: SearchFilters) => {
    setIsLoading(true);
    setSearchFilters(filters);
    // This will be expanded to fetch listings based on filters

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
      console.log('Listings fetched successfully:  ', data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings. Please try again.');
    } finally {
      // console.log('Listings fetched successfully' + listings);
      setIsLoading(false);
    }

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
                  {listings.map((listing) => (
                    <Card key={listing.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <p className="text-sm font-medium">Departure</p>
                            <p className="text-muted-foreground">{listing.route_origin}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Destination</p>
                            <p className="text-muted-foreground">{listing.route_destination}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Departure Date</p>
                            <p className="text-muted-foreground">
                              {new Date(listing.departure_date).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Delivery Date</p>
                            <p className="text-muted-foreground">
                              {new Date(listing.delivery_date).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Price(per ton)</p>
                            <p className="text-muted-foreground">{listing.price_per_ton}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
    </Layout>
  );
};

export default Listings;
