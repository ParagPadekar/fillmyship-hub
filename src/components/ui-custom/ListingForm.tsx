
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListingFormProps {
  onClose?: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    route_origin: '',
    route_destination: '',
    route_distance: '',
    departure_date: undefined as Date | undefined,
    delivery_date: undefined as Date | undefined,
    price_per_ton: '',
    capacity: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a listing');
      return;
    }
    
    if (user.role !== 'mediator' && user.role !== 'admin') {
      toast.error('Only mediators can create listings');
      return;
    }
    
    if (
      !formData.title ||
      !formData.route_origin ||
      !formData.route_destination ||
      !formData.route_distance ||
      !formData.departure_date ||
      !formData.delivery_date ||
      !formData.price_per_ton ||
      !formData.capacity
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.departure_date && formData.delivery_date && 
        formData.delivery_date <= formData.departure_date) {
      toast.error('Delivery date must be after departure date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Creating listing with user ID:', user.id);
      console.log('User object:', user);
      
      const listingData = {
        mediator_id: user.id, // This should be a UUID
        mediator_name: user.company || user.username,
        title: formData.title,
        route_origin: formData.route_origin,
        route_destination: formData.route_destination,
        route_distance: parseInt(formData.route_distance),
        departure_date: formData.departure_date,
        delivery_date: formData.delivery_date,
        price_per_ton: parseFloat(formData.price_per_ton),
        capacity: parseInt(formData.capacity),
        description: formData.description || null,
        status: 'pending' // All new listings start as pending
      };
      
      console.log('Submitting listing data:', listingData);
      
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select();
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Listing created successfully:', data);
      toast.success('Listing created successfully and pending review');
      
      // Reset form
      setFormData({
        title: '',
        route_origin: '',
        route_destination: '',
        route_distance: '',
        departure_date: undefined,
        delivery_date: undefined,
        price_per_ton: '',
        capacity: '',
        description: '',
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast.error(error.message || 'Failed to create listing');
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
            <Label htmlFor="route_origin">Origin Port</Label>
            <Input
              id="route_origin"
              name="route_origin"
              value={formData.route_origin}
              onChange={handleChange}
              placeholder="e.g. Shanghai"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="route_destination">Destination Port</Label>
            <Input
              id="route_destination"
              name="route_destination"
              value={formData.route_destination}
              onChange={handleChange}
              placeholder="e.g. Rotterdam"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="route_distance">Route Distance (km)</Label>
          <Input
            id="route_distance"
            name="route_distance"
            type="number"
            min="1"
            value={formData.route_distance}
            onChange={handleChange}
            placeholder="e.g. 12000"
            required
          />
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
                    !formData.departure_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.departure_date ? (
                    format(formData.departure_date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.departure_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, departure_date: date }))}
                  initialFocus
                  disabled={(date) => date < new Date()}
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
                    !formData.delivery_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.delivery_date ? (
                    format(formData.delivery_date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.delivery_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, delivery_date: date }))}
                  initialFocus
                  disabled={(date) => 
                    formData.departure_date ? date <= formData.departure_date : date <= new Date()
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_per_ton">Price Per Ton (USD)</Label>
            <Input
              id="price_per_ton"
              name="price_per_ton"
              type="number"
              min="0"
              step="0.01"
              value={formData.price_per_ton}
              onChange={handleChange}
              placeholder="e.g. 250.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (tons)</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
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
