
import { supabase } from '@/integrations/supabase/client';
import { CarListing } from '@/components/cars/CarCard';
import { v4 as uuidv4 } from 'uuid';

// Create a new car listing
export const createCarListing = async (
  carData: Omit<CarListing, 'id' | 'createdAt'>,
  imageFile?: File
): Promise<{ success: boolean; listing?: CarListing; error?: any }> => {
  try {
    // First upload the image if provided
    let imageUrl = carData.imageUrl;
    
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('car-images')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);
        
      imageUrl = urlData.publicUrl;
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Prepare the listing data
    const newListing = {
      title: carData.title,
      make: carData.make,
      model: carData.model,
      year: carData.year,
      price: carData.price,
      mileage: carData.mileage,
      location: carData.location,
      description: carData.description,
      image_url: imageUrl,
      user_id: user.id
    };
    
    // Insert the car listing
    const { data, error } = await supabase
      .from('car_listings')
      .insert(newListing)
      .select()
      .single();
    
    if (error) throw error;
    
    // Format the response to match the CarListing type
    const formattedListing: CarListing = {
      id: data.id,
      title: data.title,
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      location: data.location,
      description: data.description,
      imageUrl: data.image_url,
      seller: {
        id: user.id,
        name: user.user_metadata?.name || 'User',
        phone: user.user_metadata?.phone
      },
      createdAt: data.created_at
    };
    
    return { success: true, listing: formattedListing };
  } catch (error) {
    console.error('Error creating car listing:', error);
    return { success: false, error };
  }
};

// Get all car listings
export const getAllCarListings = async (): Promise<CarListing[]> => {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select(`
        *,
        profiles:user_id (
          name,
          phone
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the listings to match the CarListing type
    const formattedListings: CarListing[] = data.map(listing => ({
      id: listing.id,
      title: listing.title,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      mileage: listing.mileage,
      location: listing.location,
      description: listing.description,
      imageUrl: listing.image_url,
      seller: {
        id: listing.user_id,
        name: listing.profiles?.name || 'User',
        phone: listing.profiles?.phone
      },
      createdAt: listing.created_at
    }));
    
    return formattedListings;
  } catch (error) {
    console.error('Error getting car listings:', error);
    return [];
  }
};

// Get a specific car listing
export const getCarListing = async (id: string): Promise<CarListing | null> => {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select(`
        *,
        profiles:user_id (
          name,
          phone
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Format the listing to match the CarListing type
    const formattedListing: CarListing = {
      id: data.id,
      title: data.title,
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      location: data.location,
      description: data.description,
      imageUrl: data.image_url,
      seller: {
        id: data.user_id,
        name: data.profiles?.name || 'User',
        phone: data.profiles?.phone
      },
      createdAt: data.created_at
    };
    
    return formattedListing;
  } catch (error) {
    console.error('Error getting car listing:', error);
    return null;
  }
};

// Get car listings by user
export const getUserCarListings = async (userId: string): Promise<CarListing[]> => {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select(`
        *,
        profiles:user_id (
          name,
          phone
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the listings to match the CarListing type
    const formattedListings: CarListing[] = data.map(listing => ({
      id: listing.id,
      title: listing.title,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      mileage: listing.mileage,
      location: listing.location,
      description: listing.description,
      imageUrl: listing.image_url,
      seller: {
        id: listing.user_id,
        name: listing.profiles?.name || 'User',
        phone: listing.profiles?.phone
      },
      createdAt: listing.created_at
    }));
    
    return formattedListings;
  } catch (error) {
    console.error('Error getting user car listings:', error);
    return [];
  }
};
