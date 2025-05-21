
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { User, Phone, MapPin, Mail, Edit2 } from "lucide-react";
import { toast } from "sonner";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  location: string;
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // In a real app, this would come from a user authentication service
  const userProfile = {
    name: "Mohammed Al Farsi",
    email: "mohammed.alfarsi@example.com",
    phone: "+971 50 123 4567",
    location: "Dubai",
    joinedDate: "January 2023",
    listedCars: 3,
    savedCars: 5
  };
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      location: userProfile.location,
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would update the user profile in the backend
    console.log(data);
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="bg-car-primary text-white py-8">
        <div className="car-container">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-lg text-gray-200">Manage your account and car listings</p>
        </div>
      </div>

      <div className="car-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 bg-gray-100">
                    <User className="h-12 w-12 text-gray-500" />
                  </Avatar>
                  <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                  <p className="text-sm text-muted-foreground">Member since {userProfile.joinedDate}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold">{userProfile.listedCars}</p>
                      <p className="text-sm text-muted-foreground">Listed Cars</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userProfile.savedCars}</p>
                      <p className="text-sm text-muted-foreground">Saved Cars</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Details and Edit Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profile Details</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        rules={{ 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        rules={{ required: "Phone number is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                      
                      <div className="pt-2 flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="mt-1">{userProfile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="mt-1">{userProfile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="mt-1">{userProfile.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="mt-1">{userProfile.location}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium mb-4">My Listed Cars</h4>
                      {userProfile.listedCars > 0 ? (
                        <div className="border rounded-md p-4 bg-gray-50">
                          <p>You have {userProfile.listedCars} active car listings</p>
                          <Button variant="link" className="px-0">
                            View My Listings
                          </Button>
                        </div>
                      ) : (
                        <div className="border rounded-md p-4 bg-gray-50">
                          <p>You haven't listed any cars yet</p>
                          <Button variant="link" className="px-0">
                            Sell a Car Now
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
