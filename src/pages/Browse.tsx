
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CarCard, { CarListing } from "@/components/cars/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

// Sample car data (would come from an API in a real app)
import { sampleCars } from "@/data/sampleCars";

const Browse = () => {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setCars(sampleCars);
    setFilteredCars(sampleCars);
  }, []);

  useEffect(() => {
    // Apply filters when any filter state changes
    filterCars();
  }, [searchTerm, priceRange, selectedLocation, cars]);

  const filterCars = () => {
    let filtered = cars;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    setFilteredCars(filtered);
  };
  
  // Get unique locations for the filter dropdown
  const locations = [...new Set(sampleCars.map(car => car.location))];

  return (
    <MainLayout>
      <div className="bg-car-primary text-white py-8">
        <div className="car-container">
          <h1 className="text-3xl font-bold mb-2">Browse Used Cars</h1>
          <p className="text-lg text-gray-200">Find your dream car from our extensive collection</p>
        </div>
      </div>

      <div className="car-container py-8">
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
                    defaultValue={[0, 500000]}
                    max={500000}
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
                    setPriceRange([0, 500000]);
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
              <Select defaultValue="newest">
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
                    setPriceRange([0, 500000]);
                    setSelectedLocation("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Browse;
