
const API_BASE_URL = 'http://localhost:3001/api';

// Types for our API responses
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface CarListing {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  description: string;
  imageUrl: string;
  seller: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface CarsResponse {
  success: boolean;
  cars?: CarListing[];
  message?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(userData: { name: string; email: string; password: string; phone?: string; location?: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<{ success: boolean; user?: User }> {
    return this.request<{ success: boolean; user?: User }>('/auth/me');
  }

  // Car methods
  async getCars(): Promise<CarsResponse> {
    return this.request<CarsResponse>('/cars');
  }

  async getCarById(id: string): Promise<{ success: boolean; car?: CarListing }> {
    return this.request<{ success: boolean; car?: CarListing }>(`/cars/${id}`);
  }

  async createCar(carData: Omit<CarListing, '_id' | 'seller' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; car?: CarListing }> {
    return this.request<{ success: boolean; car?: CarListing }>('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id: string, carData: Partial<CarListing>): Promise<{ success: boolean; car?: CarListing }> {
    return this.request<{ success: boolean; car?: CarListing }>(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile methods
  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user?: User }> {
    return this.request<{ success: boolean; user?: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

export const apiService = new ApiService();
