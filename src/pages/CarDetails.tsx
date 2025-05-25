
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CarListing } from "@/components/cars/CarCard";
import { Phone, MapPin, User, Car, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/utils/persistentStorage";
import { useCarListings } from "@/hooks/useCarListings";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Use cached car listings data
  const { data: cachedCars = [] } = useCarListings();

  useEffect(() => {
    const fetchData = async () => {
      // Check if user is logged in
      const currentUser = await getCurrentUser();
      setIsLoggedIn(!!currentUser);
      
      if (id) {
        // First try to find the car in cached data
        const cachedCar = cachedCars.find(car => car.id === id);
        
        if (cachedCar) {
          console.log('Using cached car data');
          setCar(cachedCar);
          setLoading(false);
          return;
        }

        // If not found in cache, fetch from Supabase
        console.log('Fetching car details from Supabase');
        try {
          // First fetch car listing
          const { data: listing, error: listingError } = await supabase
            .from('car_listings')
            .select('*')
            .eq('id', id)
            .single();

          if (listingError || !listing) {
            console.error('Error fetching listing:', listingError);
            setCar(null);
            setLoading(false);
            return;
          }

          // Fetch profile for the seller - use maybeSingle to handle missing profiles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, name, phone, location')
            .eq('id', listing.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          // Transform listing with profile data, providing fallbacks for missing data
          const carData: CarListing = {
            id: listing.id,
            title: listing.title,
            price: listing.price,
            year: listing.year,
            mileage: listing.mileage,
            location: listing.location,
            imageUrl: listing.image_url || '',
            description: listing.description,
            make: listing.make,
            model: listing.model,
            seller: {
              id: listing.user_id,
              name: profile?.name || 'Seller',
              phone: profile?.phone || 'Contact through platform',
              location: profile?.location || listing.location
            },
            createdAt: listing.created_at
          };

          setCar(carData);
        } catch (error) {
          console.error('Error fetching car details:', error);
          setCar(null);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [id, cachedCars]);

  const handleContactSeller = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to contact the seller");
      navigate("/auth");
      return;
    }
    
    toast.success("Contact request sent to seller!");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="car-container py-12">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!car) {
    return (
      <MainLayout>
        <div className="car-container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
            <p className="mb-6">The car listing you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/browse")}>Browse Cars</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Format price with AED and commas
  const formattedPrice = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat('en').format(car.mileage);

  return (
    <MainLayout>
      <div className="car-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Details Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
              <p className="text-muted-foreground">
                Posted by {car.seller.name} on {new Date(car.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Car Image */}
            <div className="rounded-lg overflow-hidden border">
              <img
                src={car.imageUrl}
                alt={car.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Car Specifications */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">Make</p>
                  <p className="font-medium">{car.make}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Model</p>
                  <p className="font-medium">{car.model}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Year</p>
                  <p className="font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Mileage</p>
                  <p className="font-medium">{formattedMileage} km</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Location</p>
                  <p className="font-medium">{car.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Price</p>
                  <p className="font-medium text-car-primary">{formattedPrice}</p>
                </div>
              </div>
            </Card>

            {/* Car Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{car.description}</p>
            </Card>
          </div>

          {/* Seller Info & Actions Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-car-primary" />
                <h2 className="text-2xl font-bold">{formattedPrice}</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">Asking price</p>
              <Button className="w-full mb-3" onClick={handleContactSeller}>
                Contact Seller
              </Button>
              {!isLoggedIn && (
                <p className="text-center text-sm text-muted-foreground">
                  You need to <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>login</Button> to contact the seller
                </p>
              )}
            </Card>

            {/* Seller Info Card - Always show when user is logged in */}
            {isLoggedIn && (
              <Card className="p-6">
                <h3 className="font-medium mb-4">Seller Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{car.seller.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{car.seller.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{car.seller.location}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Message for non-logged-in users */}
            {!isLoggedIn && (
              <Card className="p-6">
                <h3 className="font-medium mb-4">Seller Information</h3>
                <p className="text-muted-foreground text-sm">
                  Please <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>login</Button> to view seller contact information.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CarDetails;
