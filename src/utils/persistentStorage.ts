
// This file now only handles session management - all car/user data is handled by Supabase
export const getCurrentUser = async (): Promise<any> => {
  try {
    // Check localStorage for current user
    const userJSON = localStorage.getItem("currentUser");
    if (userJSON) {
      return JSON.parse(userJSON);
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const setCurrentUser = (user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
} | null): void => {
  if (user) {
    // Store in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log("Current user set:", user.name);
  } else {
    // Clear from localStorage
    localStorage.removeItem("currentUser");
    console.log("Current user cleared");
  }
};

// Clear all localStorage data
export const clearAllLocalStorage = (): void => {
  localStorage.removeItem("users");
  localStorage.removeItem("carListings");
  localStorage.removeItem("currentUser");
  console.log("All localStorage data cleared");
};

// Initialize by clearing old data
export const initializeFromLocalStorage = async () => {
  try {
    console.log("Clearing old localStorage data");
    // Clear old localStorage data
    localStorage.removeItem("users");
    localStorage.removeItem("carListings");
    console.log("Old localStorage data cleared");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
