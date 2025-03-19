import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ListingForm = ({ onClose }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [pricePerTon, setPricePerTon] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the user's profile to include the name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, company')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      const mediatorName = profileData.company || profileData.username || user.email;
      
      console.log('Creating listing with mediator details:', {
        mediatorId: user.id,
        mediatorName
      });
      
      // Calculate route distance (mock calculation for demonstration)
      const routeDistance = Math.floor(Math.random() * 1000) + 100;
      
      const listingData = {
        title,
        mediator_id: user.id,
        mediator_name: mediatorName,
        route_origin: routeOrigin,
        route_destination: routeDestination,
        route_distance: routeDistance,
        departure_date: departureDate,
        delivery_date: deliveryDate,
        price_per_ton: Number(pricePerTon),
        capacity: Number(capacity),
        description,
        status: 'pending'
      };
      
      console.log('Submitting listing data:', listingData);
      
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select();
      
      if (error) {
        console.error('Error creating listing:', error);
        throw error;
      }
      
      console.log('Listing created successfully:', data);
      
      toast.success('Listing created successfully');
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to create listing: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cargo from Shanghai to Rotterdam"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="routeOrigin">Origin Port</Label>
          <Input
            id="routeOrigin"
            type="text"
            value={routeOrigin}
            onChange={(e) => setRouteOrigin(e.target.value)}
            placeholder="Shanghai"
            required
          />
        </div>
        <div>
          <Label htmlFor="routeDestination">Destination Port</Label>
          <Input
            id="routeDestination"
            type="text"
            value={routeDestination}
            onChange={(e) => setRouteDestination(e.target.value)}
            placeholder="Rotterdam"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={format(departureDate || new Date(), 'PPP')}
              >
                {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={format(deliveryDate || new Date(), 'PPP')}
              >
                {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={setDeliveryDate}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePerTon">Price per Ton (USD)</Label>
          <Input
            id="pricePerTon"
            type="number"
            value={pricePerTon}
            onChange={(e) => setPricePerTon(e.target.value)}
            placeholder="500"
            required
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity (Tons)</Label>
          <Input
            id="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="1000"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of the cargo and shipping terms"
          rows={4}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create Listing"}
      </Button>
    </form>
  );
};

export default ListingForm;
