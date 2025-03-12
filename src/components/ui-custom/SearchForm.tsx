
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Ship, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getAllPorts } from '@/lib/db';
import { cn } from '@/lib/utils';
import { SearchFilters } from '@/types';

interface SearchFormProps {
  isHero?: boolean;
  initialFilters?: SearchFilters;
  onSubmit?: (filters: SearchFilters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  isHero = false, 
  initialFilters, 
  onSubmit 
}) => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState<string>(initialFilters?.departure || '');
  const [destination, setDestination] = useState<string>(initialFilters?.destination || '');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    initialFilters?.departureDate
  );
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  const allPorts = getAllPorts();
  
  const departureSuggestions = departure
    ? allPorts.filter(port => 
        port.toLowerCase().includes(departure.toLowerCase())
      ).slice(0, 5)
    : [];
    
  const destinationSuggestions = destination
    ? allPorts.filter(port => 
        port.toLowerCase().includes(destination.toLowerCase())
      ).slice(0, 5)
    : [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: SearchFilters = {
      departure: departure || undefined,
      destination: destination || undefined,
      departureDate: departureDate,
    };
    
    if (onSubmit) {
      onSubmit(filters);
    } else {
      const params = new URLSearchParams();
      if (departure) params.append('departure', departure);
      if (destination) params.append('destination', destination);
      if (departureDate) params.append('departureDate', departureDate.toISOString());
      
      navigate(`/listings?${params.toString()}`);
    }
  };
  
  return (
    <form 
      onSubmit={handleSearch}
      className={cn(
        "w-full rounded-lg transition-all duration-300",
        isHero 
          ? "bg-white/80 backdrop-blur-md shadow-lg border border-white/30 p-4 md:p-6"
          : "bg-white border border-gray-200 shadow-sm p-4"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-3 relative">
          <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">Departure Port</label>
          <Input
            id="departure"
            type="text"
            placeholder="e.g. Shanghai"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            onFocus={() => setShowDepartureSuggestions(true)}
            onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 200)}
            className="w-full"
          />
          {showDepartureSuggestions && departureSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
              {departureSuggestions.map((port) => (
                <div
                  key={port}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDeparture(port);
                    setShowDepartureSuggestions(false);
                  }}
                >
                  {port}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:col-span-3 relative">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination Port</label>
          <Input
            id="destination"
            type="text"
            placeholder="e.g. Rotterdam"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowDestinationSuggestions(true)}
            onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
            className="w-full"
          />
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
              {destinationSuggestions.map((port) => (
                <div
                  key={port}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDestination(port);
                    setShowDestinationSuggestions(false);
                  }}
                >
                  {port}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="md:col-span-3 flex items-end">
          <Button 
            type="submit" 
            className="w-full h-10 bg-primary hover:bg-primary/90"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
