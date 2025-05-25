
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

interface EditListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: any;
  onSuccess: () => void;
}

const EditListingDialog = ({ open, onOpenChange, listing, onSuccess }: EditListingDialogProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Initialize form with listing data when dialog opens
  useEffect(() => {
    if (listing && open) {
      form.reset({
        make: listing.make || "",
        model: listing.model || "",
        year: listing.year?.toString() || "",
        price: listing.price?.toString() || "",
        mileage: listing.mileage?.toString() || "",
        location: listing.location || "",
        description: listing.description || "",
      });
      setImagePreview(listing.image_url || null);
    }
  }, [listing, open, form]);

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

  const onSubmit = async (data: FormValues) => {
    if (!listing) return;

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedListing = {
        title: `${data.year} ${data.make} ${data.model}`,
        make: data.make,
        model: data.model,
        price: Number(data.price),
        year: Number(data.year),
        mileage: Number(data.mileage),
        location: data.location,
        description: data.description,
        image_url: imagePreview,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from("car_listings")
        .update(updatedListing)
        .eq("id", listing.id);
      
      if (error) {
        console.error("Error updating listing:", error);
        toast.error("Failed to update your listing. Please try again.");
        return;
      }
      
      toast.success("Your listing has been updated successfully!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update your listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription>
            Update your car listing details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Car Make */}
              <FormField
                control={form.control}
                name="make"
                rules={{ required: "Make is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <FormLabel htmlFor="image" className="block mb-2">Car Image</FormLabel>
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="image" 
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'} hover:bg-gray-100`}
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Listing"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;
