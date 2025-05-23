
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Type for user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string, phone: string = '') => {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          name,
          phone
        }
      }
    });

    if (authError) {
      // Check for specific error types to provide better feedback
      if (authError.message.includes('rate limit') || authError.message.includes('seconds')) {
        return { 
          success: false, 
          error: { 
            message: "Please try again in a minute. The authentication system has rate limiting to prevent abuse." 
          } 
        };
      }
      
      if (authError.message.includes('password')) {
        return { 
          success: false, 
          error: { 
            message: "Please use a stronger password (minimum 6 characters with a mix of letters and numbers)" 
          } 
        };
      }
      
      throw authError;
    }
    
    // If sign up successful, create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          email,
          phone: phone || null
        });

      if (profileError) throw profileError;
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, session: data.session, user: data.user };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

// Get the current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get the current session
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (profile: Partial<UserProfile> & { id: string }) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};
