
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Upload } from "lucide-react";
import { toast } from "sonner";
import { CarListing } from "@/components/cars/CarCard";

// Generate years from 1990 to current year
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1990; year--) {
    years.push(year);
  }
  return years;
};

const carMakes = [
  "Toyota", "Honda", "Nissan", "Mitsubishi", "Mercedes-Benz", 
  "BMW", "Audi", "Lexus", "Ford", "Chevrolet", "Porsche",
  "Land Rover", "Jeep", "Hyundai", "Kia", "Mazda"
];

type FormValues = {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  location: string;
  description: string;
};

const Sell = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userJSON = localStorage.getItem("currentUser");
    if (userJSON) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(userJSON));
    } else {
      toast("Please login to sell your car");
      navigate("/login");
    }
  }, [navigate]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      location: "",
      description: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!isLoggedIn || !currentUser) {
      toast.error("You must be logged in to sell a car");
      navigate("/login");
      return;
    }
    
    if (!imagePreview) {
      toast.error("Please upload an image of your car");
      return;
    }
    
    try {
      // Get existing listings from localStorage
      const listingsJSON = localStorage.getItem("carListings");
      const listings = listingsJSON ? JSON.parse(listingsJSON) : [];
      
      // Create new listing
      const newListing: CarListing = {
        id: Date.now().toString(),
        title: `${data.year} ${data.make} ${data.model}`,
        make: data.make,
        model: data.model,
        price: Number(data.price),
        year: Number(data.year),
        mileage: Number(data.mileage),
        location: data.location,
        description: data.description,
        imageUrl: imagePreview,
        seller: {
          id: currentUser.id,
          name: currentUser.name,
        },
        createdAt: new Date().toISOString()
      };
      
      // Add to listings array
      listings.push(newListing);
      localStorage.setItem("carListings", JSON.stringify(listings));
      
      toast.success("Your car has been listed for sale successfully!");
      form.reset();
      setImagePreview(null);
      
      // Redirect to browse page
      navigate("/browse");
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error("Failed to list your car. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="car-container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="mb-6">You need to be logged in to sell your car.</p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-car-primary text-white py-8">
        <div className="car-container">
          <h1 className="text-3xl font-bold mb-2">Sell Your Car</h1>
          <p className="text-lg text-gray-200">Complete the form below to list your car for sale</p>
        </div>
      </div>

      <div className="car-container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car Make */}
                  <FormField
                    control={form.control}
                    name="make"
                    rules={{ required: "Make is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select make" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {carMakes.map((make) => (
                              <SelectItem key={make} value={make}>{make}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Car Model */}
                  <FormField
                    control={form.control}
                    name="model"
                    rules={{ required: "Model is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Camry, Civic, X5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Year */}
                  <FormField
                    control={form.control}
                    name="year"
                    rules={{ required: "Year is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generateYears().map((year) => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    rules={{ 
                      required: "Price is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid number"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (AED)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mileage */}
                  <FormField
                    control={form.control}
                    name="mileage"
                    rules={{ 
                      required: "Mileage is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid number"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage (KM)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    rules={{ required: "Location is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Dubai">Dubai</SelectItem>
                            <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                            <SelectItem value="Sharjah">Sharjah</SelectItem>
                            <SelectItem value="Ajman">Ajman</SelectItem>
                            <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                            <SelectItem value="Fujairah">Fujairah</SelectItem>
                            <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                            <SelectItem value="Al Ain">Al Ain</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add details about your car's condition, features, and history" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include important details like features, service history, and any modifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="space-y-4">
                  <div>
                    <FormLabel htmlFor="image" className="block mb-2">Car Images</FormLabel>
                    <div className="flex items-center justify-center w-full">
                      <label 
                        htmlFor="image" 
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'} hover:bg-gray-100`}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img src={imagePreview} alt="Preview" className="object-contain w-full h-full p-2" />
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                          </div>
                        )}
                        <input 
                          id="image" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  List Car For Sale
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sell;
