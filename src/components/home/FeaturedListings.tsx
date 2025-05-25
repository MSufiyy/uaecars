
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CarCard, { CarListing } from "@/components/cars/CarCard";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const FeaturedListings = () => {
  // Use React Query for better caching and performance
  const { data: featuredCars = [], isLoading: loading } = useQuery({
    queryKey: ['featuredListings'],
    queryFn: async (): Promise<CarListing[]> => {
      console.log('Fetching featured listings...');
      
      // First fetch car listings
      const { data: listings, error: listingsError } = await supabase
        .from('car_listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

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
