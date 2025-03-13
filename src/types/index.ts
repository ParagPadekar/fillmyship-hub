
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'mediator' | 'admin';
  createdAt: Date;
  company?: string;
}

export interface Location {
  port: string;
  country: string;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Listing {
  id: string;
  title: string;
  mediatorId: string;
  mediatorName: string;
  mediatorLogo?: string;
  departureLocation: Location;
  destinationLocation: Location;
  departureDate: Date;
  deliveryDate: Date;
  pricePerTon: number;
  currency: string;
  availableTons: number;
  description: string;
  vesselDetails?: string;
  additionalServices?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  reviews: Review[];
  averageRating: number;
}

export type SearchFilters = {
  departure?: string;
  destination?: string;
  departureDate?: Date;
  deliveryDate?: Date;
  maxPrice?: number;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (username: string, email: string, password: string, role: 'customer' | 'mediator' | 'admin') => Promise<any>;
  logout: () => Promise<void>;
}
