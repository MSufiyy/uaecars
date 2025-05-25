
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, CarListing } from '@/services/api';

export const useCarListingsAPI = () => {
  return useQuery({
    queryKey: ['carListings'],
    queryFn: async () => {
      const response = await apiService.getCars();
      if (response.success && response.cars) {
        // Transform the data to match the frontend interface
        return response.cars.map(car => ({
          id: car._id,
          title: car.title,
          price: car.price,
          year: car.year,
          mileage: car.mileage,
          location: car.location,
          imageUrl: car.imageUrl,
          description: car.description,
          make: car.make,
          model: car.model,
          seller: {
            id: car.seller.id,
            name: car.seller.name,
            phone: car.seller.phone || 'Contact through platform',
            location: car.seller.location || car.location
          },
          createdAt: car.createdAt
        }));
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCarDetailsAPI = (carId: string) => {
  return useQuery({
    queryKey: ['carDetails', carId],
    queryFn: async () => {
      const response = await apiService.getCarById(carId);
      if (response.success && response.car) {
        const car = response.car;
        return {
          id: car._id,
          title: car.title,
          price: car.price,
          year: car.year,
          mileage: car.mileage,
          location: car.location,
          imageUrl: car.imageUrl,
          description: car.description,
          make: car.make,
          model: car.model,
          seller: {
            id: car.seller.id,
            name: car.seller.name,
            phone: car.seller.phone || 'Contact through platform',
            location: car.seller.location || car.location
          },
          createdAt: car.createdAt
        };
      }
      return null;
    },
    enabled: !!carId,
  });
};
