
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Ship, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../layout/Navbar";
// import { Footer } from "react-day-picker";
import BookingForm from "./BookingForm";
import { fetchListingDetails, fetchMediatorDetails } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";

import { toast } from 'sonner';
import Footer from "../layout/Footer";

// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import BookingForm from "@/components/BookingForm";
// import { useToast } from "@/hooks/use-toast";
// import { listingService } from "@/services/api";
// import { useUser } from "@/contexts/UserContext";

const BookingPage = () => {
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
    const [mediator, setMediator] = useState(null);

    const { user, loading } = useAuth();
    // const { user } = useUser();
    // const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                // const fetchedListing = await listingService.findListingById(id);

                const fetchedListing = await fetchListingDetails(id);
                setListing(fetchedListing);

                if (!fetchedListing) {
                    toast.error("Listing Not Found");
                    // toast({
                    //     title: "Listing Not Found",
                    //     description: "The listing you're looking for doesn't exist or has been removed.",
                    //     variant: "destructive",
                    // });
                    navigate("/listings");
                    return;
                }

                setListing(fetchedListing);

                const mediator = await fetchMediatorDetails(fetchedListing.mediator_id);
                setMediator(mediator);

                if (!fetchedListing) {
                    // Fallback to the first listing if ID is not found (for demo purposes)
                    toast.error("Listing not found");
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
                toast.error("Listing Not Found");
                // toast({
                //     title: "Error",
                //     description: "Failed to load listing details. Please try again.",
                //     variant: "destructive",
                // });
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [id, navigate, toast]);

    useEffect(() => {
        // Check if user is logged in
        if (!user && !isLoading) {
            toast.error("Login Required");
            // toast({
            //     title: "Login Required",
            //     description: "Please login to book this shipping service",
            //     variant: "destructive",
            // });
            navigate(`/listings/${id}`);
        }
    }, [user, isLoading, navigate, id, toast]);

    const handleBookingSuccess = async () => {
        setBookingSuccess(true);

        // Reload the listing to get updated capacity

        const fetchedListing = await fetchListingDetails(id);
        setListing(fetchedListing);

        // listingService.findListingById(id!)
        //     .then(updatedListing => {
        //         setListing(updatedListing);
        //     })
        //     .catch(error => {
        //         console.error("Error reloading listing:", error);
        //     });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ship-600 mx-auto"></div>
                        <p className="mt-4 text-ship-600 font-medium">Loading booking details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 py-12">
                    <div className="text-center py-12">
                        <Ship className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            The listing you're looking for doesn't exist or has been removed.
                        </p>
                        <Button asChild>
                            <Link to="/listings">Browse Listings</Link>
                        </Button>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="mb-4"
                    >
                        <Link to={`/listings/${id}`} className="flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Listing
                        </Link>
                    </Button>

                    <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                    <p className="text-gray-600 flex items-center gap-1">
                        {listing.route_origin} → {listing.route_destination}
                    </p>
                </div>

                {bookingSuccess ? (
                    <div className="max-w-lg mx-auto bg-green-50 p-8 rounded-lg text-center">
                        <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your cargo space has been booked successfully. You can view your booking details in your dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                                <Link to="/dashboard">View Bookings</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/listings">Browse More Listings</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <BookingForm
                                listing={listing}
                                onSuccess={handleBookingSuccess}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Listing:</span>
                                        <span className="font-medium">{listing.title}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mediator:</span>
                                        <span className="font-medium">
                                            {mediator.company_name}
                                            {/* {listing.mediatorId.mediatorDetails?.companyName || listing.mediatorId.name} */}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Departure:</span>
                                        <span className="font-medium">
                                            {new Date(listing.departure_date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Arrival:</span>
                                        <span className="font-medium">
                                            {new Date(listing.delivery_date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Available Capacity:</span>
                                        <span className="font-medium">
                                            {listing.capacity - listing.capacity_used} / {listing.capacity} {listing.capacity.unit}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price per {listing.capacity.unit}:</span>
                                        <span className="font-medium">
                                            {listing.price} {listing.currency}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium mb-2">Important Information</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Bookings are subject to final approval by the mediator</li>
                                        <li>• Payment will be processed after booking confirmation</li>
                                        <li>• Cancellation policy applies as per Terms of Service</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BookingPage;
