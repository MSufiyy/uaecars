
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, User } from '@/services/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; phone?: string; location?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      return false;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string; location?: string }): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        toast.success('Registration successful!');
        return true;
      } else {
        toast.error(response.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      const response = await apiService.updateProfile(profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error('Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
