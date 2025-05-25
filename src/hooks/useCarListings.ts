
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarListing } from "@/components/cars/CarCard";

export const useCarListings = (limit?: number) => {
  return useQuery({
    queryKey: ['carListings'],
    queryFn: async (): Promise<CarListing[]> => {
      console.log('Fetching car listings...');
      
      // Fetch car listings
      let query = supabase
        .from('car_listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data: listings, error } = await query;

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      if (!listings || listings.length === 0) {
        return [];
      }

      // Get unique user IDs
      const userIds = [...new Set(listings.map(listing => listing.user_id))];
      
      // Fetch profiles for all users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, phone')
        .in('id', userIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      }

      // Create a map of profiles for quick lookup
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }

      // Transform listings with profile data
      return listings.map(listing => {
        const profile = profileMap.get(listing.user_id);
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
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes (longer cache)
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
