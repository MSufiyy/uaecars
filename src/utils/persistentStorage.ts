
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
