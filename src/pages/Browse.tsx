import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CarCard, { CarListing } from "@/components/cars/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Browse = () => {
  const [filteredCars, setFilteredCars] = useState<CarListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Use React Query for better caching and performance
  const { data: cars = [], isLoading: loading } = useQuery({
    queryKey: ['allListings'],
    queryFn: async (): Promise<CarListing[]> => {
      console.log('Fetching all listings...');
      
      // First fetch car listings
      const { data: listings, error: listingsError } = await supabase
        .from('car_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingsError) {
        console.error('Error fetching listings:', listingsError);
        throw listingsError;
      }

      if (!listings || listings.length === 0) {
        return [];
      }

      // Get unique user IDs
      const userIds = [...new Set(listings.map(listing => listing.user_id))];
      
      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, phone')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of profiles for quick lookup
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Transform listings with profile data
      return listings.map(listing => {
        const profile = profilesMap.get(listing.user_id);
        return {
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
            name: profile?.name || 'Unknown',
            phone: profile?.phone
          },
          createdAt: listing.created_at
        };
      });
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  useEffect(() => {
    // Apply filters and sorting when any filter state changes
    filterAndSortCars();
  }, [searchTerm, priceRange, selectedLocation, sortBy, cars]);

  const filterAndSortCars = () => {
    let filtered = cars;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );
    
    // Filter by location
    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter(car => 
        car.location === selectedLocation
      );
    }
    
    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        default:
          return 0;
      }
    });
    
    setFilteredCars(filtered);
  };
  
  // Get unique locations for the filter dropdown
  const locations = cars.length > 0 ? 
    [...new Set(cars.map(car => car.location))] : [];

  return (
    <MainLayout>
      <div className="bg-car-primary text-white py-8">
        <div className="car-container">
          <h1 className="text-3xl font-bold mb-2">Browse Used Cars</h1>
          <p className="text-lg text-gray-200">Find your dream car from our collection</p>
        </div>
      </div>

      <div className="car-container py-8">
        {loading ? (
          <div className="text-center py-12">
            <p>Loading listings...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No cars available</h3>
            <p className="text-muted-foreground mb-6">Be the first to list your car for sale</p>
            <Link to="/sell">
              <Button>Sell Your Car</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-20">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                <div className="space-y-6">
                  {/* Search Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Price Range (AED)</Label>
                      <span className="text-sm text-muted-foreground">
                        {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 1000000]}
                      max={1000000}
                      step={10000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value)}
                      className="py-4"
                    />
                  </div>
                  
                  {/* Location Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Any Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Location</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Reset Filters */}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setPriceRange([0, 1000000]);
                      setSelectedLocation("all");
                    }}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Car Listings */}
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredCars.length}</span> cars
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setPriceRange([0, 1000000]);
                      setSelectedLocation("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Browse;
