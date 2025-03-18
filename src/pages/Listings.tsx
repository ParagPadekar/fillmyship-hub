
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/ui-custom/SearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SearchFilters } from '@/types';

const Listings = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Parse query parameters for initial search filters
  const initialFilters: SearchFilters = {
    departure: queryParams.get('departure') || undefined,
    destination: queryParams.get('destination') || undefined,
    departureDate: queryParams.get('departureDate') 
      ? new Date(queryParams.get('departureDate') as string) 
      : undefined
  };
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialFilters);
  
  const handleSearchSubmit = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // This will be expanded to fetch listings based on filters
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
              {searchFilters.departure || searchFilters.destination ? (
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
