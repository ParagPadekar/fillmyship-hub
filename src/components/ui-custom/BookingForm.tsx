
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Package, ShoppingCart, Check, MapPin, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


// import { IListing } from "@/models/Listing";
// import { bookingService } from "@/services/api";
// import { useUser } from "@/contexts/UserContext";
// import mongoose from "mongoose";

interface BookingFormProps {
    listing: any;
    onSuccess: () => void;
}

const BookingForm = ({ listing, onSuccess }: BookingFormProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    // const [cargoType, setCargoType] = useState<string>(listing.cargoTypes[0] || "");
    const [description, setDescription] = useState<string>("");
    const [specialInstructions, setSpecialInstructions] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const [isModalOpen, setIsModalOpen] = useState(false);


    // const [listing, setListing] = useState<any>({
    //     ...initialListing,
    //     capacity: {
    //         ...initialListing.capacity,
    //         unit: 'TEU'
    //     }
    // });

    // const listingWithCapacity = {
    //     ...initialListing,
    //     capacity: {
    //         ...initialListing.capacity,
    //         unit: 'TEU' // or whatever unit you're using
    //     }
    // };
    // 


    // console.log("bEFOREEE Boookigb forn ksitnt - " + JSON.stringify(listing))

    listing = {
        ...listing,
        capacity: {
            total: listing.capacity,
            available: listing.capacity - listing.capacity_used,
            unit: 'TEU' // or whatever unit you're using
        }
    };

    // console.log("Boookigb forn ksitnt - " + JSON.stringify(listing))

    // setListing(listingWithCapacity);
    // const { user } = useUser();
    // const { toast } = useToast();

    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const totalPrice = quantity * listing.price_per_ton;
    const isQuantityValid = quantity > 0 && quantity <= listing.capacity.available;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
        // window.alert("booking confirmed")



        // if (!user) {
        //     toast.error("Login Required");
        //     // toast({
        //     //     title: "Login Required",
        //     //     description: "Please login to book this shipping service",
        //     //     variant: "destructive",
        //     // });
        //     return;
        // }

        // if (!isQuantityValid) {
        //     toast.error("Invalid Quantity");
        //     // toast({
        //     //     title: "Invalid Quantity",
        //     //     description: `Please enter a quantity between 1 and ${listing.capacity.available} ${listing.capacity.unit}`,
        //     //     variant: "destructive",
        //     // });
        //     return;
        // }

        // setIsSubmitting(true);

        // try {
        //     // Get user ID safely - could be in id or _id property
        //     const userId = user.id || user._id;

        //     // Get mediator ID safely - could be an object with _id or a string
        //     const mediatorId = typeof listing.mediatorId === 'object' && listing.mediatorId._id
        //         ? listing.mediatorId._id
        //         : listing.mediatorId;

        //     // Get listing ID
        //     const listingId = listing._id || listing.id;

        //     // Convert string IDs to MongoDB ObjectIds
        //     const userObjectId = new mongoose.Types.ObjectId(userId);
        //     const mediatorObjectId = new mongoose.Types.ObjectId(mediatorId);
        //     const listingObjectId = new mongoose.Types.ObjectId(listingId);

        //     // Create booking data with proper ObjectIds
        //     const bookingData = {
        //         listingId: listingObjectId,
        //         userId: userObjectId,
        //         mediatorId: mediatorObjectId,
        //         status: 'pending',
        //         cargoDetails: {
        //             // type: cargoType,
        //             quantity: quantity,
        //             unit: listing.capacity.unit,
        //             description: description,
        //             specialInstructions: specialInstructions,
        //         },
        //         price: totalPrice,
        //         currency: listing.currency,
        //         paymentStatus: 'pending'
        //     };

        //     // Create booking
        //     await bookingService.createBooking(bookingData);

        //     // Update listing capacity
        //     const updatedCapacity = {
        //         ...listing.capacity,
        //         available: listing.capacity.available - quantity
        //     };

        //     await bookingService.updateListingCapacity(listingId, updatedCapacity);

        //     // Show success message
        //     toast({
        //         title: "Booking Successful",
        //         description: "Your booking has been created successfully",
        //     });

        //     // Call success callback
        //     onSuccess();

        // } catch (error) {
        //     console.error("Error creating booking:", error);
        //     toast({
        //         title: "Booking Failed",
        //         description: "There was an error creating your booking. Please try again.",
        //         variant: "destructive",
        //     });
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Book Cargo Space
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping Route:</span>
                            <span className="font-medium">{listing.route_origin} → {listing.route_destination}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Departure:</span>
                            <span className="font-medium flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(listing.departure_date).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Available Capacity:</span>
                            <span className="font-medium">{listing.capacity.available} {listing.capacity.unit}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Price per {listing.capacity.unit}:</span>
                            <span className="font-medium">{listing.price_per_ton} {listing.currency}</span>
                        </div>
                    </div>

                    {/* <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-1">
                            Cargo Type
                        </label>
                        <Select
                            // value={cargoType}
                            // onValueChange={setCargoType}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select cargo type" />
                            </SelectTrigger>
                            <SelectContent>
                                {listing.cargoTypes.map((type: string) => (
                                    <SelectItem key={type} value={type}>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            {type}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Quantity ({listing.capacity.unit})
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max={listing.capacity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            required
                        />
                        {!isQuantityValid && quantity !== 0 && (
                            <p className="text-xs text-red-500 mt-1">
                                Quantity must be between 1 and {listing.capacity.available} {listing.capacity.unit}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Cargo Description
                        </label>
                        <Textarea
                            placeholder="Describe your cargo (contents, dimensions, etc.)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Special Instructions (Optional)
                        </label>
                        <Textarea
                            placeholder="Any special handling instructions or requirements"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between font-medium text-lg mb-4">
                            <span>Total Price:</span>
                            <span className="text-ship-700">{totalPrice} {listing.currency}</span>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-ship-600 hover:bg-ship-700"
                            disabled={isSubmitting || !isQuantityValid}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                                    Processing...
                                </span>
                            ) : (
                                <Button
                                    // className="w-full bg-ship-600 hover:bg-ship-700 mb-2"
                                    className=" h-10 bg-primary hover:bg-primary/90 mb-2"
                                // onClick={handleBookNow(e)}
                                >
                                    <Check className="h-4 w-4" />
                                    Confirm Booking
                                </Button>
                                // <span className="flex items-center gap-2 bg-primary hover:bg-primary/90 mb-2">
                                //     <Check className="h-4 w-4" />
                                //     Confirm Booking
                                // </span>
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-gray-500">
                        By confirming your booking, you agree to our Terms of Service and Cancellation Policy
                    </p>
                </form>
            </CardContent>


            {/* Mediator Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Booking Confirmation</DialogTitle>
                        <DialogDescription>
                            Booking confirmed successfully.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </Card>
    );
};

export default BookingForm;
