
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CarCard, { CarListing } from "@/components/cars/CarCard";
import { Link } from "react-router-dom";

// Sample car data
const sampleCars: CarListing[] = [
  {
    id: "1",
    title: "2019 Mercedes-Benz S-Class S 450",
    price: 259000,
    year: 2019,
    mileage: 45000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u1",
      name: "Dubai Luxury Motors"
    }
  },
  {
    id: "2",
    title: "2021 BMW X5 xDrive40i",
    price: 310000,
    year: 2021,
    mileage: 32000,
    location: "Abu Dhabi",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u2",
      name: "Premium Auto UAE"
    }
  },
  {
    id: "3",
    title: "2020 Audi A6 45 TFSI",
    price: 175000,
    year: 2020,
    mileage: 58000,
    location: "Sharjah",
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=900", 
    seller: {
      id: "u3",
      name: "Elite Cars"
    }
  },
  {
    id: "4",
    title: "2022 Range Rover Sport HSE",
    price: 425000,
    year: 2022,
    mileage: 18000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u4",
      name: "Emirates Auto"
    }
  },
  {
    id: "5",
    title: "2018 Lexus ES 350",
    price: 120000,
    year: 2018,
    mileage: 65000,
    location: "Al Ain",
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u5",
      name: "Al Ain Motors"
    }
  },
  {
    id: "6",
    title: "2021 Toyota Land Cruiser VXR",
    price: 375000,
    year: 2021,
    mileage: 42000,
    location: "Ras Al Khaimah",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u6",
      name: "RAK Auto Traders"
    }
  }
];

const FeaturedListings = () => {
  const [featuredCars, setFeaturedCars] = useState<CarListing[]>([]);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use our sample data
    setFeaturedCars(sampleCars);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="car-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="section-title">Featured Listings</h2>
            <p className="section-subtitle">Discover our handpicked premium vehicles</p>
          </div>
          <Link to="/browse">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
