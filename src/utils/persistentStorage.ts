import { CarListing } from "@/components/cars/CarCard";

// File paths for IndexedDB data
const DB_NAME = "uaeCarsDB";
const DB_VERSION = 1;
const USERS_STORE = "users";
const CARS_STORE = "cars";

// Initialize the database
export const initializeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is available
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      reject("IndexedDB not supported");
      return;
    }
    
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Error opening database");
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log("IndexedDB connected successfully");
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create users store
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const usersStore = db.createObjectStore(USERS_STORE, { keyPath: "id" });
        usersStore.createIndex("email", "email", { unique: true });
        console.log("Users store created");
      }
      
      // Create cars store
      if (!db.objectStoreNames.contains(CARS_STORE)) {
        const carsStore = db.createObjectStore(CARS_STORE, { keyPath: "id" });
        carsStore.createIndex("sellerId", "seller.id", { unique: false });
        console.log("Cars store created");
      }
    };
  });
};

// User functions
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export const saveUser = async (user: User): Promise<boolean> => {
  try {
    // Save to localStorage for cross-browser compatibility
    const usersJSON = localStorage.getItem("users") || "[]";
    let users = JSON.parse(usersJSON);
    
    // Find and update or add user
    const existingIndex = users.findIndex((u: User) => u.id === user.id);
    if (existingIndex !== -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem("users", JSON.stringify(users));
    
    // Then try to save to IndexedDB for persistence
    const db = await initializeDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(USERS_STORE, "readwrite");
      const store = transaction.objectStore(USERS_STORE);
      
      const request = store.put(user);
      
      request.onsuccess = () => {
        console.log("User saved successfully:", user.id);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error("Error saving user to IndexedDB:", event);
        // Still return true because we saved to localStorage
        resolve(true);
      };
      
      transaction.oncomplete = () => {
        console.log("User transaction completed");
      };
    });
  } catch (error) {
    console.error("Error in saveUser:", error);
    
    // As a fallback, try saving only to localStorage
    try {
      const usersJSON = localStorage.getItem("users") || "[]";
      let users = JSON.parse(usersJSON);
      
      const existingIndex = users.findIndex((u: User) => u.id === user.id);
      if (existingIndex !== -1) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    } catch (lsError) {
      console.error("Failed to save to localStorage:", lsError);
      return false;
    }
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    // Try IndexedDB first
    const db = await initializeDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(USERS_STORE, "readonly");
      const store = transaction.objectStore(USERS_STORE);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const users = request.result;
        console.log(`Found ${users.length} users in IndexedDB`);
        
        // Keep localStorage in sync
        localStorage.setItem("users", JSON.stringify(users));
        resolve(users);
      };
      
      request.onerror = () => {
        console.error("Error getting users from IndexedDB, falling back to localStorage");
        // Fall back to localStorage
        const usersJSON = localStorage.getItem("users") || "[]";
        const users = JSON.parse(usersJSON);
        resolve(users);
      };
    });
  } catch (error) {
    console.error("Error in getUsers, falling back to localStorage:", error);
    // Fall back to localStorage
    const usersJSON = localStorage.getItem("users") || "[]";
    return JSON.parse(usersJSON);
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    // Try IndexedDB first
    const db = await initializeDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(USERS_STORE, "readonly");
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index("email");
      
      const request = index.get(email);
      
      request.onsuccess = () => {
        const user = request.result || null;
        
        if (!user) {
          // If not found in IndexedDB, check localStorage
          const usersJSON = localStorage.getItem("users") || "[]";
          const users = JSON.parse(usersJSON);
          const localUser = users.find((u: User) => u.email === email) || null;
          
          if (localUser) {
            // If found in localStorage but not IndexedDB, sync it back to IndexedDB
            saveUser(localUser);
          }
          
          resolve(localUser);
        } else {
          resolve(user);
        }
      };
      
      request.onerror = () => {
        console.error("Error getting user by email from IndexedDB, checking localStorage");
        // Fall back to localStorage
        const usersJSON = localStorage.getItem("users") || "[]";
        const users = JSON.parse(usersJSON);
        const user = users.find((u: User) => u.email === email) || null;
        resolve(user);
      };
    });
  } catch (error) {
    console.error("Error in getUserByEmail, checking localStorage:", error);
    // Fall back to localStorage
    const usersJSON = localStorage.getItem("users") || "[]";
    const users = JSON.parse(usersJSON);
    return users.find((u: User) => u.email === email) || null;
  }
};

export const updateUser = async (user: User): Promise<boolean> => {
  try {
    // Make sure localStorage stays in sync
    const usersJSON = localStorage.getItem("users") || "[]";
    let users = JSON.parse(usersJSON);
    
    const existingIndex = users.findIndex((u: User) => u.id === user.id);
    if (existingIndex !== -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem("users", JSON.stringify(users));
    
    // Update current user if it's the same user
    const currentUserLS = localStorage.getItem("currentUser");
    if (currentUserLS) {
      const currentUser = JSON.parse(currentUserLS);
      if (currentUser.id === user.id) {
        localStorage.setItem("currentUser", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          location: user.location || ""
        }));
      }
    }
    
    // Save to IndexedDB
    return await saveUser(user);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return false;
  }
};

// Car functions
export const saveListing = async (car: CarListing): Promise<boolean> => {
  try {
    // Save to localStorage for cross-browser compatibility
    const listingsJSON = localStorage.getItem("carListings") || "[]";
    let allListings = JSON.parse(listingsJSON);
    
    // Find and update or add the listing
    const existingIndex = allListings.findIndex((c: CarListing) => c.id === car.id);
    if (existingIndex !== -1) {
      allListings[existingIndex] = car;
    } else {
      allListings.push(car);
    }
    
    localStorage.setItem("carListings", JSON.stringify(allListings));
    console.log(`Car listing saved to localStorage: ${car.id}`);
    
    // Then try to save to IndexedDB for persistence
    try {
      const db = await initializeDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(CARS_STORE, "readwrite");
        const store = transaction.objectStore(CARS_STORE);
        
        const request = store.put(car);
        
        request.onsuccess = () => {
          console.log("Car listing saved to IndexedDB successfully:", car.id);
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error("Error saving car listing to IndexedDB:", event);
          // Still return true because we saved to localStorage
          resolve(true);
        };
      });
    } catch (dbError) {
      console.error("IndexedDB error in saveListing:", dbError);
      // Already saved to localStorage, so return true
      return true;
    }
  } catch (error) {
    console.error("Error in saveListing:", error);
    return false;
  }
};

export const loadListings = async (): Promise<CarListing[]> => {
  try {
    console.log("Loading all car listings...");
    
    // Always get from localStorage first for faster loading
    const listingsJSON = localStorage.getItem("carListings") || "[]";
    let listings = JSON.parse(listingsJSON);
    
    // Then try to get from IndexedDB and sync
    try {
      const db = await initializeDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(CARS_STORE, "readonly");
        const store = transaction.objectStore(CARS_STORE);
        
        const request = store.getAll();
        
        request.onsuccess = () => {
          const results = request.result;
          console.log(`Found ${results.length} car listings in IndexedDB`);
          
          // If we have listings in IndexedDB and none in localStorage, or fewer in localStorage
          if (results.length > 0 && (listings.length === 0 || results.length > listings.length)) {
            localStorage.setItem("carListings", JSON.stringify(results));
            resolve(results);
          } else if (listings.length > results.length) {
            // If we have more listings in localStorage, sync them to IndexedDB
            console.log("Syncing listings from localStorage to IndexedDB");
            listings.forEach((car: CarListing) => {
              if (!results.find((c: CarListing) => c.id === car.id)) {
                saveListing(car);
              }
            });
            resolve(listings);
          } else {
            resolve(listings);
          }
        };
        
        request.onerror = (event) => {
          console.error("Error getting car listings from IndexedDB:", event);
          resolve(listings);
        };
      });
    } catch (dbError) {
      console.error("IndexedDB error in loadListings:", dbError);
      return listings;
    }
  } catch (error) {
    console.error("Error in loadListings:", error);
    // Return empty array as last resort
    return [];
  }
};

export const getListingsByUser = async (userId: string): Promise<CarListing[]> => {
  try {
    const allListings = await loadListings();
    return allListings.filter((car: CarListing) => car.seller.id === userId);
  } catch (error) {
    console.error("Error in getListingsByUser:", error);
    return [];
  }
};

export const getListing = async (id: string): Promise<CarListing | null> => {
  try {
    // Try localStorage first for faster loading
    const listingsJSON = localStorage.getItem("carListings");
    if (listingsJSON) {
      const allListings = JSON.parse(listingsJSON);
      const listing = allListings.find((car: CarListing) => car.id === id);
      if (listing) return listing;
    }
    
    // Then try IndexedDB
    try {
      const db = await initializeDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(CARS_STORE, "readonly");
        const store = transaction.objectStore(CARS_STORE);
        
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        
        request.onerror = (event) => {
          console.error("Error getting car listing:", event);
          resolve(null);
        };
      });
    } catch (dbError) {
      console.error("IndexedDB error in getListing:", dbError);
      return null;
    }
  } catch (error) {
    console.error("Error in getListing:", error);
    return null;
  }
};

// Session management
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
    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log("Current user set:", user.name);
  } else {
    localStorage.removeItem("currentUser");
    console.log("Current user cleared");
  }
};

// Initialize data from localStorage on first load
export const initializeFromLocalStorage = async () => {
  try {
    console.log("Initializing data from localStorage to IndexedDB");
    
    // Migrate users
    const usersJSON = localStorage.getItem("users");
    if (usersJSON) {
      const users = JSON.parse(usersJSON);
      console.log(`Migrating ${users.length} users to IndexedDB`);
      for (const user of users) {
        await saveUser(user);
      }
    }
    
    // Migrate car listings
    const listingsJSON = localStorage.getItem("carListings");
    if (listingsJSON) {
      const listings = JSON.parse(listingsJSON);
      console.log(`Migrating ${listings.length} car listings to IndexedDB`);
      for (const listing of listings) {
        await saveListing(listing);
      }
    }
    
    console.log("Data migration from localStorage to IndexedDB completed");
  } catch (error) {
    console.error("Error migrating data from localStorage:", error);
  }
};
