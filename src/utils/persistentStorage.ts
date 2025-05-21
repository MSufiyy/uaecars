import { CarListing } from "@/components/cars/CarCard";

// File paths for IndexedDB data
const DB_NAME = "uaeCarsDB";
const DB_VERSION = 1;
const USERS_STORE = "users";
const CARS_STORE = "cars";

// Initialize the database
export const initializeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Error opening database");
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create users store
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const usersStore = db.createObjectStore(USERS_STORE, { keyPath: "id" });
        usersStore.createIndex("email", "email", { unique: true });
      }
      
      // Create cars store
      if (!db.objectStoreNames.contains(CARS_STORE)) {
        const carsStore = db.createObjectStore(CARS_STORE, { keyPath: "id" });
        carsStore.createIndex("sellerId", "seller.id", { unique: false });
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
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(USERS_STORE, "readwrite");
      const store = transaction.objectStore(USERS_STORE);
      
      const request = store.put(user);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error("Error saving user:", event);
        reject(false);
      };
    });
  } catch (error) {
    console.error("Error in saveUser:", error);
    return false;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(USERS_STORE, "readonly");
      const store = transaction.objectStore(USERS_STORE);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error("Error getting users:", event);
        reject([]);
      };
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(USERS_STORE, "readonly");
      const store = transaction.objectStore(USERS_STORE);
      const index = store.index("email");
      
      const request = index.get(email);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = (event) => {
        console.error("Error getting user by email:", event);
        reject(null);
      };
    });
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return null;
  }
};

export const updateUser = async (user: User): Promise<boolean> => {
  try {
    // Make sure localStorage stays in sync for backward compatibility
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
    
    return await saveUser(user);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return false;
  }
};

// Car functions
export const saveListing = async (car: CarListing): Promise<boolean> => {
  try {
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CARS_STORE, "readwrite");
      const store = transaction.objectStore(CARS_STORE);
      
      const request = store.put(car);
      
      request.onsuccess = () => {
        console.log("Car listing saved successfully:", car.id);
        // Make sure localStorage is completely in sync - important for persistence
        const listingsJSON = localStorage.getItem("carListings");
        let allListings = listingsJSON ? JSON.parse(listingsJSON) : [];
        
        const existingIndex = allListings.findIndex((c: CarListing) => c.id === car.id);
        if (existingIndex !== -1) {
          allListings[existingIndex] = car;
        } else {
          allListings.push(car);
        }
        
        localStorage.setItem("carListings", JSON.stringify(allListings));
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error("Error saving car listing:", event);
        reject(false);
      };
    });
  } catch (error) {
    console.error("Error in saveListing:", error);
    return false;
  }
};

export const loadListings = async (): Promise<CarListing[]> => {
  try {
    console.log("Loading all car listings...");
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CARS_STORE, "readonly");
      const store = transaction.objectStore(CARS_STORE);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        const results = request.result;
        console.log(`Found ${results.length} car listings in IndexedDB`);
        
        // Always keep localStorage in sync
        localStorage.setItem("carListings", JSON.stringify(results));
        resolve(results);
      };
      
      request.onerror = (event) => {
        console.error("Error getting car listings from IndexedDB:", event);
        // Fall back to localStorage
        const listingsJSON = localStorage.getItem("carListings");
        const listings = listingsJSON ? JSON.parse(listingsJSON) : [];
        console.log(`Falling back to localStorage: found ${listings.length} listings`);
        resolve(listings);
      };
    });
  } catch (error) {
    console.error("Error in loadListings:", error);
    // Fall back to localStorage
    const listingsJSON = localStorage.getItem("carListings");
    return listingsJSON ? JSON.parse(listingsJSON) : [];
  }
};

export const getListingsByUser = async (userId: string): Promise<CarListing[]> => {
  try {
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CARS_STORE, "readonly");
      const store = transaction.objectStore(CARS_STORE);
      const index = store.index("sellerId");
      
      const request = index.getAll(userId);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error("Error getting listings by user:", event);
        reject([]);
      };
    });
  } catch (error) {
    console.error("Error in getListingsByUser:", error);
    // Fall back to localStorage
    const listingsJSON = localStorage.getItem("carListings");
    if (listingsJSON) {
      const allListings = JSON.parse(listingsJSON);
      return allListings.filter((car: CarListing) => car.seller.id === userId);
    }
    return [];
  }
};

export const getListing = async (id: string): Promise<CarListing | null> => {
  try {
    const db = await initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CARS_STORE, "readonly");
      const store = transaction.objectStore(CARS_STORE);
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = (event) => {
        console.error("Error getting car listing:", event);
        reject(null);
      };
    });
  } catch (error) {
    console.error("Error in getListing:", error);
    // Fall back to localStorage
    const listingsJSON = localStorage.getItem("carListings");
    if (listingsJSON) {
      const allListings = JSON.parse(listingsJSON);
      return allListings.find((car: CarListing) => car.id === id) || null;
    }
    return null;
  }
};

// Session management
export const getCurrentUser = async (): Promise<any> => {
  try {
    // Check localStorage first for backward compatibility
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
}): void => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
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
