
import { Listing, Location, Review, SearchFilters } from '@/types';

// Mock data generator
const generateMockListings = (): Listing[] => {
  const locations: Location[] = [
    { port: 'Shanghai', country: 'China' },
    { port: 'Singapore', country: 'Singapore' },
    { port: 'Rotterdam', country: 'Netherlands' },
    { port: 'Los Angeles', country: 'USA' },
    { port: 'Dubai', country: 'UAE' },
    { port: 'Hamburg', country: 'Germany' },
    { port: 'New York', country: 'USA' },
    { port: 'Tokyo', country: 'Japan' },
    { port: 'Mumbai', country: 'India' },
    { port: 'Sydney', country: 'Australia' }
  ];

  const mediators = [
    { id: 'mediator1', name: 'Global Shipping Co.', logo: '/placeholder.svg' },
    { id: 'mediator2', name: 'Ocean Links', logo: '/placeholder.svg' },
    { id: 'mediator3', name: 'SeaRoute International', logo: '/placeholder.svg' },
    { id: 'mediator4', name: 'Maritime Solutions', logo: '/placeholder.svg' },
    { id: 'mediator5', name: 'Cargo Connect', logo: '/placeholder.svg' }
  ];

  const generateReviews = (mediatorId: string): Review[] => {
    const reviewCount = Math.floor(Math.random() * 10) + 1;
    const reviews: Review[] = [];
    
    for (let i = 0; i < reviewCount; i++) {
      const rating = Math.floor(Math.random() * 5) + 1;
      reviews.push({
        id: `review${mediatorId}${i}`,
        userId: `user${i}`,
        username: `User ${i}`,
        rating,
        comment: [
          'Great service, arrived on time!',
          'Good communication throughout the journey.',
          'Slightly delayed but handled professionally.',
          'Very reliable service, would use again.',
          'Excellent handling of our cargo, no damages.',
          'The service was just okay, nothing special.',
          'They were very responsive to our queries.',
          'A bit expensive but worth the quality.'
        ][Math.floor(Math.random() * 8)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      });
    }
    
    return reviews;
  };

  const listings: Listing[] = [];
  
  for (let i = 0; i < 50; i++) {
    const departureIndex = Math.floor(Math.random() * locations.length);
    let destinationIndex = Math.floor(Math.random() * locations.length);
    
    // Ensure departure and destination are different
    while (destinationIndex === departureIndex) {
      destinationIndex = Math.floor(Math.random() * locations.length);
    }
    
    const mediatorIndex = Math.floor(Math.random() * mediators.length);
    const mediator = mediators[mediatorIndex];
    
    const now = new Date();
    const departureDate = new Date(now.getTime() + (Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000));
    const transitDays = Math.floor(Math.random() * 30) + 10;
    const deliveryDate = new Date(departureDate.getTime() + (transitDays * 24 * 60 * 60 * 1000));
    
    const reviews = generateReviews(mediator.id);
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    listings.push({
      id: `listing${i}`,
      title: `Cargo from ${locations[departureIndex].port} to ${locations[destinationIndex].port}`,
      mediatorId: mediator.id,
      mediatorName: mediator.name,
      mediatorLogo: mediator.logo,
      departureLocation: locations[departureIndex],
      destinationLocation: locations[destinationIndex],
      departureDate,
      deliveryDate,
      pricePerTon: Math.floor(Math.random() * 500) + 100,
      currency: 'USD',
      availableTons: Math.floor(Math.random() * 1000) + 100,
      description: `Direct shipping service from ${locations[departureIndex].port} to ${locations[destinationIndex].port}. Reliable and efficient transportation for your cargo needs.`,
      vesselDetails: ['Container Ship', 'Bulk Carrier', 'Tanker'][Math.floor(Math.random() * 3)],
      additionalServices: [
        'Customs Clearance',
        'Insurance',
        'Last Mile Delivery',
        'Warehousing',
        'Packaging'
      ].slice(0, Math.floor(Math.random() * 5) + 1),
      status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected',
      createdAt: new Date(now.getTime() - (Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000)),
      updatedAt: now,
      reviews,
      averageRating: isNaN(averageRating) ? 0 : averageRating
    });
  }
  
  return listings;
};

// Initialize mock database with listings
let mockListings = generateMockListings();

// Helper function to get ports from listings
export const getAllPorts = (): string[] => {
  const ports = new Set<string>();
  
  mockListings.forEach(listing => {
    ports.add(listing.departureLocation.port);
    ports.add(listing.destinationLocation.port);
  });
  
  return Array.from(ports).sort();
};

// DB Operations
export const getApprovedListings = async (
  filters?: SearchFilters,
  sort: 'price' | 'rating' = 'price',
  page = 1,
  limit = 10
): Promise<{ listings: Listing[], total: number }> => {
  let filteredListings = mockListings.filter(listing => listing.status === 'approved');
  
  // Apply filters
  if (filters) {
    if (filters.departure) {
      filteredListings = filteredListings.filter(
        listing => listing.departureLocation.port.toLowerCase().includes(filters.departure!.toLowerCase())
      );
    }
    
    if (filters.destination) {
      filteredListings = filteredListings.filter(
        listing => listing.destinationLocation.port.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }
    
    if (filters.departureDate) {
      filteredListings = filteredListings.filter(listing => {
        const listingDate = new Date(listing.departureDate);
        const filterDate = new Date(filters.departureDate!);
        return (
          listingDate.getFullYear() === filterDate.getFullYear() &&
          listingDate.getMonth() === filterDate.getMonth() &&
          listingDate.getDate() === filterDate.getDate()
        );
      });
    }
    
    if (filters.deliveryDate) {
      filteredListings = filteredListings.filter(listing => {
        const listingDate = new Date(listing.deliveryDate);
        const filterDate = new Date(filters.deliveryDate!);
        return (
          listingDate.getFullYear() === filterDate.getFullYear() &&
          listingDate.getMonth() === filterDate.getMonth() &&
          listingDate.getDate() === filterDate.getDate()
        );
      });
    }
    
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(
        listing => listing.pricePerTon <= filters.maxPrice!
      );
    }
  }
  
  // Apply sorting
  if (sort === 'price') {
    filteredListings.sort((a, b) => a.pricePerTon - b.pricePerTon);
  } else if (sort === 'rating') {
    filteredListings.sort((a, b) => b.averageRating - a.averageRating);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    listings: paginatedListings,
    total: filteredListings.length
  };
};

export const getPendingListings = async (): Promise<Listing[]> => {
  const pendingListings = mockListings.filter(listing => listing.status === 'pending');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return pendingListings;
};

export const getMediatorListings = async (mediatorId: string): Promise<Listing[]> => {
  const mediatorListings = mockListings.filter(listing => listing.mediatorId === mediatorId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mediatorListings;
};

export const getListingById = async (id: string): Promise<Listing | null> => {
  const listing = mockListings.find(listing => listing.id === id) || null;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return listing;
};

export const createListing = async (listing: Omit<Listing, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reviews' | 'averageRating'>): Promise<Listing> => {
  const newListing: Listing = {
    ...listing,
    id: `listing${Date.now()}`,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [],
    averageRating: 0
  };
  
  mockListings.push(newListing);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return newListing;
};

export const updateListingStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Listing> => {
  const listingIndex = mockListings.findIndex(listing => listing.id === id);
  
  if (listingIndex === -1) {
    throw new Error('Listing not found');
  }
  
  mockListings[listingIndex] = {
    ...mockListings[listingIndex],
    status,
    updatedAt: new Date()
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockListings[listingIndex];
};

export const addReview = async (listingId: string, review: Omit<Review, 'id' | 'createdAt'>): Promise<Listing> => {
  const listingIndex = mockListings.findIndex(listing => listing.id === listingId);
  
  if (listingIndex === -1) {
    throw new Error('Listing not found');
  }
  
  const newReview: Review = {
    ...review,
    id: `review${Date.now()}`,
    createdAt: new Date()
  };
  
  const updatedReviews = [...mockListings[listingIndex].reviews, newReview];
  const averageRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
  
  mockListings[listingIndex] = {
    ...mockListings[listingIndex],
    reviews: updatedReviews,
    averageRating,
    updatedAt: new Date()
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockListings[listingIndex];
};
