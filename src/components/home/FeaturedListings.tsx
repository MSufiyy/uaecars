
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CarCard, { CarListing } from "@/components/cars/CarCard";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FeaturedListings = () => {
  const [featuredCars, setFeaturedCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarListings = async () => {
      try {
        const { data: listings, error } = await supabase
          .from('car_listings')
          .select(`
            *,
            profiles!car_listings_user_id_fkey (
              id,
              name,
              phone
            )
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }

        if (listings) {
          // Transform Supabase data to match CarListing interface
          const transformedListings: CarListing[] = listings.map(listing => ({
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
              name: listing.profiles?.name || 'Unknown',
              phone: listing.profiles?.phone
            },
            createdAt: listing.created_at
          }));
          
          setFeaturedCars(transformedListings);
        }
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCarListings();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="car-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="section-title">Featured Listings</h2>
            <p className="section-subtitle">Discover our latest vehicle listings</p>
          </div>
          <Link to="/browse">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p>Loading listings...</p>
          </div>
        ) : featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to list your car for sale</p>
            <Link to="/sell">
              <Button>Sell Your Car</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
