
import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '@/types';
import { formatDistance } from 'date-fns';
import { Ship, Calendar, MapPin, Tag, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const transitTime = formatDistance(
    new Date(listing.deliveryDate),
    new Date(listing.departureDate)
  );
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md animate-fade-up">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 mr-3 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {listing.mediatorLogo ? (
                  <img 
                    src={listing.mediatorLogo} 
                    alt={listing.mediatorName} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Ship className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{listing.mediatorName}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {listing.averageRating.toFixed(1)} 
                    <span className="text-gray-400 ml-1">
                      ({listing.reviews.length} reviews)
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-primary">
                ${listing.pricePerTon}
              </span>
              <span className="text-sm text-gray-500 ml-1">per ton</span>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">
            {listing.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <div className="flex items-center">
                <span className="text-sm text-gray-600">
                  {listing.departureLocation.port}, {listing.departureLocation.country}
                </span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="text-sm text-gray-600">
                  {listing.destinationLocation.port}, {listing.destinationLocation.country}
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {new Date(listing.departureDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
                <span className="mx-2 text-gray-400">•</span>
                Transit time: {transitTime}
              </span>
            </div>
            
            <div className="flex items-center">
              <Tag className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                Available capacity: {listing.availableTons} tons
              </span>
            </div>
          </div>
          
          {listing.additionalServices && listing.additionalServices.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {listing.additionalServices.map((service, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50 text-gray-600">
                  {service}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t">
        <Button asChild className="w-full">
          <Link to={`/listings/${listing.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
