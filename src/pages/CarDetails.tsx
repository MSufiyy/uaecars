
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MessageCircle, Share2, Heart, Car } from "lucide-react";
import { CarListing } from "@/components/cars/CarCard";
import { sampleCars } from "@/data/sampleCars";
import { useToast } from "@/components/ui/use-toast";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get car details
    setIsLoading(true);
    setTimeout(() => {
      const foundCar = sampleCars.find(c => c.id === id);
      setCar(foundCar || null);
      setIsLoading(false);
    }, 500);

    // For demo purposes, check if user is authenticated
    // In a real app, this would check auth state
    setIsAuthenticated(false);
  }, [id]);

  const handleContactClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login or register to contact the seller.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Contact request sent",
        description: "The seller will get back to you soon.",
      });
    }
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login or register to save favorites.",
        variant: "destructive",
      });
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "This car has been removed from your favorites." 
        : "This car has been added to your favorites.",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="car-container py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!car) {
    return (
      <MainLayout>
        <div className="car-container py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
          <p className="mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse">
            <Button>Browse Cars</Button>
          </Link>
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

  // Format mileage with commas
  const formattedMileage = new Intl.NumberFormat('en').format(car.mileage);

  return (
    <MainLayout>
      <div className="car-container py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-car-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/browse" className="hover:text-car-primary">Browse</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{car.title}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Car Details */}
          <div className="md:col-span-2">
            {/* Car Image */}
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={car.imageUrl} 
                alt={car.title} 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Car Title & Price */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{car.title}</h1>
              <p className="text-2xl font-bold text-car-primary mt-2">{formattedPrice}</p>
            </div>

            {/* Car Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Year</p>
                <p className="font-semibold text-lg">{car.year}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Mileage</p>
                <p className="font-semibold text-lg">{formattedMileage} km</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Location</p>
                <p className="font-semibold text-lg">{car.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Seller</p>
                <p className="font-semibold text-lg">{car.seller.name}</p>
              </div>
            </div>

            {/* Tabs for Car Details */}
            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="mb-4">
                      This {car.year} {car.title.split(' ').slice(1).join(' ')} is in excellent condition with only {formattedMileage} kilometers on the odometer. 
                      It has been well-maintained by its previous owner and comes with a full service history.
                    </p>
                    <p>
                      The car features premium leather interior, panoramic sunroof, adaptive cruise control, and a state-of-the-art infotainment system. 
                      It has never been in an accident and has been kept in a garage throughout its life.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Leather Seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Navigation System</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Bluetooth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Backup Camera</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Sunroof</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Parking Sensors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Climate Control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-car-primary" />
                        <span>Alloy Wheels</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Make:</p>
                        <p>{car.title.split(' ')[1]}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Model:</p>
                        <p>{car.title.split(' ').slice(2).join(' ')}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Year:</p>
                        <p>{car.year}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Mileage:</p>
                        <p>{formattedMileage} km</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Body Type:</p>
                        <p>Sedan</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Fuel Type:</p>
                        <p>Petrol</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Transmission:</p>
                        <p>Automatic</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Color:</p>
                        <p>White</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Contact Seller Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Seller</h3>
                <div className="space-y-4">
                  <Button 
                    onClick={handleContactClick}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call Seller</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleContactClick}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email Seller</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleContactClick}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={toggleFavorite}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-car-primary text-car-primary' : ''}`} />
                      Favorite
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link copied",
                          description: "Car listing URL copied to clipboard.",
                        });
                      }}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Seller Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Seller Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-car-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-car-primary font-bold">{car.seller.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{car.seller.name}</p>
                      <p className="text-sm text-muted-foreground">Member since 2021</p>
                    </div>
                  </div>
                  <Link to={`/user/${car.seller.id}`}>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CarDetails;
