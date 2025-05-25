
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;

      try {
        // Try to fetch existing profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile",
          });
          return null;
        }

        if (data) {
          // Profile exists
          return data;
        } else {
          // No profile exists, create one
          console.log("No profile found for user, creating one...");
          return await createProfile();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const createProfile = async (): Promise<Profile | null> => {
    if (!user) return null;

    try {
      const newProfile = {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create profile",
        });
        return null;
      } else {
        console.log("Profile created successfully:", data);
        toast({
          title: "Welcome!",
          description: "Your profile has been created successfully",
        });
        return data;
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      return null;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile",
        });
        return false;
      } else {
        // Update the cached profile data
        queryClient.setQueryData(['profile', user.id], { ...profile, ...updates });
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        return true;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch,
  };
};
