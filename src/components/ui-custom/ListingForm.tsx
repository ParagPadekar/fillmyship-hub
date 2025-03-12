
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { createListing, getAllPorts } from '@/lib/db';
import { Listing, Location } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ListingForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allPorts = getAllPorts();

  const [formData, setFormData] = useState({
    title: '',
    departurePort: '',
    departureCountry: '',
    destinationPort: '',
    destinationCountry: '',
    departureDate: undefined as Date | undefined,
    deliveryDate: undefined as Date | undefined,
    pricePerTon: '',
    availableTons: '',
    description: '',
    vesselDetails: '',
    additionalServices: ''
  });

  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const departureSuggestions = formData.departurePort
    ? allPorts.filter(port => 
        port.toLowerCase().includes(formData.departurePort.toLowerCase())
      ).slice(0, 5)
    : [];
    
  const destinationSuggestions = formData.destinationPort
    ? allPorts.filter(port => 
        port.toLowerCase().includes(formData.destinationPort.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePortSelect = (port: string, type: 'departure' | 'destination') => {
    // Extract country from port (format: "Port, Country")
    const parts = port.split(', ');
    if (parts.length === 2) {
      if (type === 'departure') {
        setFormData(prev => ({
          ...prev,
          departurePort: parts[0],
          departureCountry: parts[1]
        }));
        setShowDepartureSuggestions(false);
      } else {
        setFormData(prev => ({
          ...prev,
          destinationPort: parts[0],
          destinationCountry: parts[1]
        }));
        setShowDestinationSuggestions(false);
      }
    } else {
      // Just set the port if no country is found
      if (type === 'departure') {
        setFormData(prev => ({ ...prev, departurePort: port }));
        setShowDepartureSuggestions(false);
      } else {
        setFormData(prev => ({ ...prev, destinationPort: port }));
        setShowDestinationSuggestions(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a listing');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'mediator' && user.role !== 'admin') {
      toast.error('Only mediators can create listings');
      return;
    }
    
    // Validate form
    if (
      !formData.title ||
      !formData.departurePort ||
      !formData.departureCountry ||
      !formData.destinationPort ||
      !formData.destinationCountry ||
      !formData.departureDate ||
      !formData.deliveryDate ||
      !formData.pricePerTon ||
      !formData.availableTons ||
      !formData.description
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check that delivery date is after departure date
    if (formData.departureDate && formData.deliveryDate && 
        formData.deliveryDate <= formData.departureDate) {
      toast.error('Delivery date must be after departure date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const departureLocation: Location = {
        port: formData.departurePort,
        country: formData.departureCountry
      };
      
      const destinationLocation: Location = {
        port: formData.destinationPort,
        country: formData.destinationCountry
      };
      
      const listingData: Omit<Listing, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reviews' | 'averageRating'> = {
        title: formData.title,
        mediatorId: user.id,
        mediatorName: user.company || user.username,
        departureLocation,
        destinationLocation,
        departureDate: formData.departureDate!,
        deliveryDate: formData.deliveryDate!,
        pricePerTon: parseFloat(formData.pricePerTon),
        currency: 'USD',
        availableTons: parseFloat(formData.availableTons),
        description: formData.description,
        vesselDetails: formData.vesselDetails || undefined,
        additionalServices: formData.additionalServices ? 
          formData.additionalServices.split(',').map(s => s.trim()) : 
          undefined
      };
      
      await createListing(listingData);
      toast.success('Listing created successfully and pending review');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create listing');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Listing Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Direct shipping from Shanghai to Rotterdam"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departurePort">Departure Port</Label>
            <div className="relative">
              <Input
                id="departurePort"
                name="departurePort"
                value={formData.departurePort}
                onChange={handleChange}
                onFocus={() => setShowDepartureSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 200)}
                placeholder="e.g. Shanghai"
                required
              />
              {showDepartureSuggestions && departureSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
                  {departureSuggestions.map((port) => (
                    <div
                      key={port}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePortSelect(port, 'departure')}
                    >
                      {port}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="departureCountry">Departure Country</Label>
            <Input
              id="departureCountry"
              name="departureCountry"
              value={formData.departureCountry}
              onChange={handleChange}
              placeholder="e.g. China"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destinationPort">Destination Port</Label>
            <div className="relative">
              <Input
                id="destinationPort"
                name="destinationPort"
                value={formData.destinationPort}
                onChange={handleChange}
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                placeholder="e.g. Rotterdam"
                required
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
                  {destinationSuggestions.map((port) => (
                    <div
                      key={port}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePortSelect(port, 'destination')}
                    >
                      {port}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destinationCountry">Destination Country</Label>
            <Input
              id="destinationCountry"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleChange}
              placeholder="e.g. Netherlands"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Departure Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.departureDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.departureDate ? (
                    format(formData.departureDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.departureDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, departureDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.deliveryDate ? (
                    format(formData.deliveryDate, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.deliveryDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
                  initialFocus
                  disabled={(date) => 
                    formData.departureDate ? date < formData.departureDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricePerTon">Price Per Ton (USD)</Label>
            <Input
              id="pricePerTon"
              name="pricePerTon"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerTon}
              onChange={handleChange}
              placeholder="e.g. 250.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availableTons">Available Capacity (tons)</Label>
            <Input
              id="availableTons"
              name="availableTons"
              type="number"
              min="0"
              step="0.01"
              value={formData.availableTons}
              onChange={handleChange}
              placeholder="e.g. 500"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Listing Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide details about the shipping service..."
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vesselDetails">Vessel Details (optional)</Label>
          <Input
            id="vesselDetails"
            name="vesselDetails"
            value={formData.vesselDetails}
            onChange={handleChange}
            placeholder="e.g. Container Ship, Bulk Carrier"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="additionalServices">Additional Services (comma separated, optional)</Label>
          <Input
            id="additionalServices"
            name="additionalServices"
            value={formData.additionalServices}
            onChange={handleChange}
            placeholder="e.g. Customs Clearance, Insurance, Last Mile Delivery"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
      </Button>
    </form>
  );
};

export default ListingForm;
