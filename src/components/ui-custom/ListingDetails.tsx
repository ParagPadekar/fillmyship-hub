
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Ship,
    Calendar,
    ArrowRight,
    DollarSign,
    Package,
    Star,
    Clock,
    MapPin,
    Shield,
    User,
    MessageSquare,
    Mail,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import defaultUserLogo from "../../../public/user.png";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { listings, mediators, reviews, ports } from "@/data/mockData";
// import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { toast } from 'sonner';
import { userInfo } from "os";
import { fetchListingDetails, fetchMediatorDetails } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";


// export const fetchMediatorDetails = async (mediatorId: string) => {
//     // setLoadingMediator(true);
//     try {
//         const { data, error } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', mediatorId)
//             .single();

//         if (error) {
//             console.error('Error fetching mediator details:', error);
//             toast.error('Failed to load mediator profile.');
//             throw error;
//         }

//         return data;

//         //   setSelectedMediator(data);
//         //   setIsModalOpen(true);
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         //   setLoadingMediator(false);

//     }

// };

// // fetch the listing details
// const fetchListingDetails = async (listingId: string) => {

//     const { data, error } = await supabase
//         .from('listings')
//         .select('*')
//         .eq('id', listingId)
//         .single();

//     if (error) {
//         console.error('Error fetching listings:', error);
//         throw error;
//     }
//     // const listing = data;
//     return data;
// }

const ListingDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState(null);
    const [mediator, setMediator] = useState(null);
    // const [listingReviews, setListingReviews] = useState(reviews.filter(r => r.mediatorId === mediator?.id));
    // const { user } = useUser();
    // const { toast } = useToast();

    const { user, loading } = useAuth();



    // fetch mediator of that listing
    // Function to fetch mediator details
    const fetchAllData = async () => {

        let found_listing = await fetchListingDetails(id);


        found_listing = {
            ...found_listing,
            capacity: {
                total: found_listing.capacity,
                available: found_listing.capacity - found_listing.capacity_used,
                unit: 'TEU' // or whatever unit you're using
            }
        };
        // console.log("bEFOREEE Boookigb forn ksitnt - " + JSON.stringify(found_listing))
        setListing(found_listing);


        const mediator = await fetchMediatorDetails(found_listing.mediator_id);
        setMediator(mediator);

        if (!found_listing) {
            // Fallback to the first listing if ID is not found (for demo purposes)
            toast.error("Listing not found");
        }

    }



    useEffect(() => {
        // In a real app, we would fetch the listing details from an API
        fetchAllData();


    }, []);

    if (!listing || !mediator) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleBookNow = () => {
        window.alert("dev in progress.. ");
        // if (!user) {
        //     toast({
        //         title: "Login Required",
        //         description: "Please login to book this shipping service",
        //         variant: "destructive",
        //     });
        //     return;
        // }

        // toast({
        //     title: "Booking Initiated",
        //     description: "Your booking request has been received!",
        // });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 order-2 md:order-1">
                        {/* Listing Title and Basic Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
                                {listing.featured && (
                                    <span className="bg-ship-500 text-white text-xs font-semibold py-1 px-3 rounded">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center text-sm text-gray-700 mb-4">
                                <div className="flex-1">
                                    <p className="font-medium">{listing.route_origin}</p>
                                    {/* <p className="text-xs text-gray-500">{listing.originPort.country} ({listing.originPort.code})</p> */}
                                </div>
                                <ArrowRight className="h-5 w-5 mx-4 flex-shrink-0 text-gray-400" />
                                <div className="flex-1">
                                    <p className="font-medium">{listing.route_destination}</p>
                                    {/* <p className="text-xs text-gray-500">{listing.destinationPort.country} ({listing.destinationPort.code})</p> */}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Departure Date</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-ship-600" />
                                        {new Date(listing.departure_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Arrival Date</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <Calendar className="h-4 w-4 text-ship-600" />
                                        {new Date(listing.delivery_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Transit Time</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-ship-600" />
                                        {Math.round((new Date(listing.delivery_date).getTime() - new Date(listing.departure_date).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Price per TEU</span>
                                    <span className="font-medium text-ship-700 flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        {/* {listing.price.toLocaleString()} {listing.currency} */}
                                        {listing.price_per_ton.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* 
                            <div className="flex items-start gap-4 mb-6">
                                <img
                                    src={mediator.logo ? mediator.logo : defaultUserLogo}
                                    alt={mediator.name}
                                    className="h-12 w-12 object-contain rounded-full bg-gray-100 p-2"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{mediator.name}</p>
                                    <div className="flex items-center gap-1 text-sm">
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(mediator.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                                    }`} />
                                            ))}
                                        </div>
                                        <span className="text-gray-600">({mediator.reviews} reviews)</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Operating since {mediator.yearEstablished}</p>
                                </div>
                            </div> */}

                            {/* <div className="flex flex-wrap gap-2">
                                {listing.cargoTypes.map((type) => (
                                    <span key={type} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {type}
                                    </span>
                                ))}
                            </div> */}

                        </div>

                        {/* Tabs for Details, Mediator Info, and Reviews */}
                        <Tabs defaultValue="details" className="mb-6">
                            <TabsList className="grid grid-cols-3 mb-6">
                                <TabsTrigger value="details">Shipment Details</TabsTrigger>
                                <TabsTrigger value="mediator">Mediator Info</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Description</h3>
                                        <p className="text-gray-700">{listing.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Cargo Capacity</h3>
                                        <div className="bg-ship-50 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-700">Available Capacity:</span>
                                                <span className="font-medium">
                                                    {/* {listing.capacity_used} / {listing.capacity} {listing.capacity.unit} */}
                                                    {listing.capacity.available} / {listing.capacity.total} {listing.capacity.unit}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${(listing.capacity_used / listing.capacity.total) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Route Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="h-5 w-5 text-ship-600" />
                                                    <h4 className="font-medium">Origin Port</h4>
                                                </div>
                                                <p className="text-gray-900 font-medium">{listing.route_origin}</p>
                                                {/* <p className="text-gray-600">{listing.originPort.country}</p>
                                                <p className="text-gray-500 text-sm mt-1">Port Code: {listing.originPort.code}</p> */}
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="h-5 w-5 text-ship-600" />
                                                    <h4 className="font-medium">Destination Port</h4>
                                                </div>
                                                <p className="text-gray-900 font-medium">{listing.route_destination}</p>
                                                {/* <p className="text-gray-600">{listing.destinationPort.country}</p>
                                                <p className="text-gray-500 text-sm mt-1">Port Code: {listing.destinationPort.code}</p> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div>
                                        <h3 className="text-lg font-medium mb-2">Accepted Cargo Types</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {listing.cargoTypes.map((type) => (
                                                <div key={type} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                                    <Package className="h-4 w-4 text-gray-600" />
                                                    <span className="text-gray-800">{type}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                     */}
                                </div>
                            </TabsContent>

                            <TabsContent value="mediator" className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <img
                                        src={mediator.logo ? mediator.logo : defaultUserLogo}
                                        alt={mediator.company_name}
                                        className="h-16 w-16 object-contain rounded-full bg-gray-100 p-3"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold">{mediator.company_name}</h2>
                                        <div className="flex items-center gap-1 text-sm">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(mediator.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                                        }`} />
                                                ))}
                                            </div>
                                            <span className="text-gray-600">({mediator.reviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center mt-2 gap-2">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                Verified
                                            </span>
                                            {/* <span className="text-xs text-gray-500">Member since {mediator.yearEstablished}</span> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">About</h3>
                                    <p className="text-gray-700">{mediator.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-3">
                                                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Email</p>
                                                    <p className="text-sm text-muted-foreground">{mediator.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Work Phone</p>
                                                    <p className="text-sm text-muted-foreground">{mediator.contact_phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Address</p>
                                                    <p className="text-sm text-muted-foreground">{mediator.company_address}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Legal Information</h3>
                                        <div className="space-y-2">
                                            <p className="text-gray-700 flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-500">License Number:</span> {mediator.licenseNumber}
                                            </p>
                                            <p className="text-gray-700 flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-500">Insurance:</span> {mediator.insuranceInfo}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* <Button variant="outline" className="w-full">
                                    <MessageSquare className="h-4 w-4 mr-2" />Contact Mediator
                                </Button> */}
                            </TabsContent>

                            {/* <TabsContent value="reviews" className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold">Customer Reviews</h2>

                                    <div className="flex items-center">
                                        <div className="text-3xl font-bold text-gray-900 mr-2">{mediator.rating}</div>
                                        <div>
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(mediator.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                                        }`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600">Based on {mediator.reviews} reviews</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {listingReviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-8 w-8 p-1 bg-gray-100 text-gray-500 rounded-full" />
                                                    <div>
                                                        <p className="font-medium">{review.userName}</p>
                                                        <div className="flex">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                                                    }`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                            </div>

                                            <p className="text-gray-700 mb-4">{review.comment}</p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <p className="text-xs text-gray-500">Reliability</p>
                                                    <div className="flex items-center">
                                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                        <span className="ml-1 text-sm font-medium">{review.metrics.reliability}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <p className="text-xs text-gray-500">Communication</p>
                                                    <div className="flex items-center">
                                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                        <span className="ml-1 text-sm font-medium">{review.metrics.communication}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <p className="text-xs text-gray-500">Value for Money</p>
                                                    <div className="flex items-center">
                                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                        <span className="ml-1 text-sm font-medium">{review.metrics.valueForMoney}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <p className="text-xs text-gray-500">Accuracy</p>
                                                    <div className="flex items-center">
                                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                        <span className="ml-1 text-sm font-medium">{review.metrics.accuracy}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {review.verified && (
                                                <div className="flex items-center gap-1 mt-3">
                                                    <Shield className="h-4 w-4 text-green-600" />
                                                    <span className="text-xs text-green-600 font-medium">Verified Booking</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent> */}


                        </Tabs>
                    </div>

                    {/* Booking Card */}
                    <div className="w-full md:w-80 order-1 md:order-2">
                        <div className="sticky top-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Book This Shipment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Price per TEU:</span>
                                        <span className="font-medium">$ {listing.price_per_ton} {listing.currency}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Capacity Available:</span>
                                        <span className="font-medium">{listing.capacity.available} {listing.capacity.unit}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Departure:</span>
                                        <span className="font-medium">{new Date(listing.departure_date).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Arrival:</span>
                                        <span className="font-medium">{new Date(listing.delivery_date).toLocaleDateString()}</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <Button
                                            // className="w-full bg-ship-600 hover:bg-ship-700 mb-2"
                                            className="w-full h-10 bg-primary hover:bg-primary/90 mb-2"
                                        // onClick={handleBookNow}
                                        >
                                            <Link to={user ? `/booking/${listing._id || listing.id}` : "#"} onClick={!user ? handleBookNow : undefined}>
                                                {listing.capacity.available > 0 ? "Book Now" : "Fully Booked"}
                                            </Link>
                                            {/* Book Now */}
                                        </Button>

                                        {/* <Button variant="outline" className="w-full">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Contact Mediator
                                        </Button> */}
                                    </div>

                                    <div className="text-xs text-center text-gray-500 pt-4">
                                        <p>By booking, you agree to our</p>
                                        <div className="flex justify-center space-x-1">
                                            <a href="#" className="text-ship-600 hover:underline">Terms of Service</a>
                                            <span>and</span>
                                            <a href="#" className="text-ship-600 hover:underline">Cancellation Policy</a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                            {/* similar listings */}
                            {/* <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="font-medium mb-2">Similar Listings</h3>
                                <div className="space-y-3">
                                    {listings
                                        .filter(l =>
                                            l.id !== listing.id &&
                                            (l.originPort.id === listing.originPort.id ||
                                                l.destinationPort.id === listing.destinationPort.id)
                                        )
                                        .slice(0, 2)
                                        .map(similarListing => (
                                            <Link
                                                key={similarListing.id}
                                                to={`/listings/${similarListing.id}`}
                                                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                            >
                                                <p className="font-medium text-sm">{similarListing.title}</p>
                                                <div className="flex justify-between text-xs mt-1">
                                                    <span className="text-gray-600">
                                                        {new Date(similarListing.departureDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="font-medium text-ship-700">
                                                        ${similarListing.price}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div> */}



                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ListingDetails;
