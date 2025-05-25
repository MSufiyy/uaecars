import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user's car listings
  const { data: userListings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ["userListings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("car_listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Initialize form fields when profile loads
  React.useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    const success = await updateProfile({
      name,
      phone,
      location
    });
    
    if (success) {
      setEditMode(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("car_listings")
        .delete()
        .eq("id", listingId)
        .eq("user_id", user?.id); // Extra security check

      if (error) {
        console.error("Error deleting listing:", error);
        toast.error("Failed to delete listing");
        return;
      }

      toast.success("Listing deleted successfully");
      // Refresh the listings
      queryClient.invalidateQueries({ queryKey: ["userListings", user?.id] });
      // Also refresh the car listings cache
      queryClient.invalidateQueries({ queryKey: ["carListings"] });
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="car-container py-12">
          <div className="text-center">
            <div className="text-lg">Loading profile...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user || !profile) {
    return (
      <MainLayout>
        <div className="car-container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="mb-6">You need to be logged in to view your profile.</p>
            <Button onClick={() => navigate("/auth")}>Go to Login</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="car-container py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="listings">My Listings ({userListings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and settings
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-car-primary h-20 w-20 rounded-full flex items-center justify-center text-white text-2xl">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                
                {editMode ? (
                  <div className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Dubai, UAE"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{phone || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{location || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                {editMode ? (
                  <div className="flex gap-4 w-full">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setName(profile.name || "");
                        setPhone(profile.phone || "");
                        setLocation(profile.location || "");
                        setEditMode(false);
                      }}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditMode(true)} className="w-full">
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="listings">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">My Car Listings</h2>
                <Button onClick={() => navigate("/sell")}>
                  Add New Listing
                </Button>
              </div>
              
              {listingsLoading ? (
                <div className="text-center py-12">Loading listings...</div>
              ) : userListings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">You haven't listed any cars yet</h3>
                    <p className="text-muted-foreground mb-6">
                      When you list a car for sale, it will appear here
                    </p>
                    <Button onClick={() => navigate("/sell")}>
                      Sell Your Car
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={listing.image_url || "/placeholder.svg"} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold">{listing.title}</h3>
                        <p className="text-xl font-bold text-car-primary mt-1">
                          {new Intl.NumberFormat('en-AE', {
                            style: 'currency',
                            currency: 'AED',
                            maximumFractionDigits: 0,
                          }).format(listing.price)}
                        </p>
                        <div className="text-sm text-muted-foreground mt-2">
                          Listed on {new Date(listing.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => navigate(`/car/${listing.id}`)}>
                          View Listing
                        </Button>
                        <Button variant="outline" size="icon" className="shrink-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this listing? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteListing(listing.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
