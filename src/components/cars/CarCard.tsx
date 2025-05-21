
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface CarListing {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  imageUrl: string;
  description: string;
  make: string;
  model: string;
  seller: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface CarCardProps {
  car: CarListing;
}

const CarCard = ({ car }: CarCardProps) => {
  // Format price with AED and commas
  const formattedPrice = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(car.price);

  // Format mileage with commas
  const formattedMileage = new Intl.NumberFormat('en').format(car.mileage);

  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={car.imageUrl} 
          alt={car.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <Link to={`/car/${car.id}`}>
          <h3 className="text-xl font-semibold hover:text-car-primary transition-colors">
            {car.title}
          </h3>
        </Link>
        <p className="text-2xl font-bold text-car-primary mt-2">
          {formattedPrice}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>Year: <span className="font-medium text-foreground">{car.year}</span></div>
          <div>Mileage: <span className="font-medium text-foreground">{formattedMileage} km</span></div>
          <div className="col-span-2">Location: <span className="font-medium text-foreground">{car.location}</span></div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Posted by <span className="text-car-primary">{car.seller.name}</span>
        </p>
        <Link to={`/car/${car.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
