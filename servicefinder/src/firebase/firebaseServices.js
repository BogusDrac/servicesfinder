import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from "firebase/storage";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { db, auth, storage } from "./firebaseConfig";

// ==================== AUTH SERVICES ====================

export const authService = {
  /**
   * Sign in user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User object
   */
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  /**
   * Sign up new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {object} additionalData - Additional user data (optional)
   * @returns {Promise<object>} User object
   */
  signUp: async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: additionalData.displayName || '',
        photoURL: additionalData.photoURL || '',
        phone: additionalData.phone || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Failed to log out. Please try again.");
    }
  },

  /**
   * Listen to auth state changes
   * @param {function} callback - Callback function to handle auth state changes
   * @returns {function} Unsubscribe function
   */
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Get current user
   * @returns {object|null} Current user or null
   */
  getCurrentUser: () => {
    return auth.currentUser;
  },

  /**
   * Update user profile
   * @param {object} profileData - Profile data to update
   * @returns {Promise<void>}
   */
  updateUserProfile: async (profileData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in");
      
      await updateProfile(user, profileData);
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error("Failed to update profile");
    }
  },

  /**
   * Update user email
   * @param {string} newEmail - New email address
   * @returns {Promise<void>}
   */
  updateUserEmail: async (newEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in");
      
      await updateEmail(user, newEmail);
    } catch (error) {
      console.error("Update email error:", error);
      throw new Error("Failed to update email. You may need to re-authenticate.");
    }
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  updateUserPassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently signed in");
      
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error("Update password error:", error);
      throw new Error("Failed to update password. You may need to re-authenticate.");
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  sendPasswordReset: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw new Error("Failed to send password reset email");
    }
  },

  /**
   * Re-authenticate user (required before sensitive operations)
   * @param {string} password - Current password
   * @returns {Promise<void>}
   */
  reauthenticate: async (password) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No user is currently signed in");
      
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error("Re-authentication error:", error);
      throw new Error("Failed to re-authenticate. Please check your password.");
    }
  }
};

// ==================== STORAGE SERVICES ====================

export const storageService = {
  /**
   * Upload image to Firebase Storage
   * @param {File} file - Image file to upload
   * @param {string} folder - Folder name in storage (default: 'services')
   * @returns {Promise<string>} Download URL of uploaded image
   */
  uploadImage: async (file, folder = 'services') => {
    try {
      if (!file) throw new Error("No file provided");
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload JPG, PNG, WEBP, or GIF");
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size exceeds 5MB limit");
      }
      
      // Create a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}_${randomString}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${filename}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(error.message || "Failed to upload image");
    }
  },

  /**
   * Delete image from Firebase Storage
   * @param {string} imageUrl - URL of the image to delete
   * @returns {Promise<void>}
   */
  deleteImage: async (imageUrl) => {
    try {
      if (!imageUrl) return;
      
      // Extract the path from the URL
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      // Don't throw error if image doesn't exist
      if (error.code !== 'storage/object-not-found') {
        throw new Error("Failed to delete image");
      }
    }
  },

  /**
   * Upload multiple images
   * @param {Array<File>} files - Array of image files
   * @param {string} folder - Folder name in storage
   * @returns {Promise<Array<string>>} Array of download URLs
   */
  uploadMultipleImages: async (files, folder = 'services') => {
    try {
      const uploadPromises = files.map(file => storageService.uploadImage(file, folder));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw new Error("Failed to upload one or more images");
    }
  }
};

// ==================== FIRESTORE SERVICES ====================

export const serviceService = {
  /**
   * Get all services
   * @returns {Promise<Array>} Array of services
   */
  getAllServices: async () => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting services:", error);
      throw new Error("Failed to fetch services");
    }
  },

  /**
   * Get services by category
   * @param {string} category - Category to filter by
   * @returns {Promise<Array>} Array of services
   */
  getServicesByCategory: async (category) => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef, 
        where('category', '==', category.toLowerCase()),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting services by category:", error);
      throw new Error("Failed to fetch services");
    }
  },

  /**
   * Get services by user
   * @param {string} userId - User ID to filter by
   * @returns {Promise<Array>} Array of services
   */
  getServicesByUser: async (userId) => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting user services:", error);
      throw new Error("Failed to fetch user services");
    }
  },

  /**
   * Get services by city
   * @param {string} city - City to filter by
   * @returns {Promise<Array>} Array of services
   */
  getServicesByCity: async (city) => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef, 
        where('city', '==', city),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting services by city:", error);
      throw new Error("Failed to fetch services");
    }
  },

  /**
   * Get top rated services
   * @param {number} limitCount - Number of services to return (default: 10)
   * @returns {Promise<Array>} Array of top rated services
   */
  getTopRatedServices: async (limitCount = 10) => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef, 
        orderBy('rating', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting top rated services:", error);
      throw new Error("Failed to fetch top rated services");
    }
  },

  /**
   * Add new service
   * @param {object} serviceData - Service data
   * @param {string} userId - ID of user adding the service
   * @returns {Promise<string>} ID of created service
   */
  addService: async (serviceData, userId) => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const servicesRef = collection(db, 'services');
      const docRef = await addDoc(servicesRef, {
        ...serviceData,
        userId: userId,
        rating: serviceData.rating || 5,
        category: serviceData.category.toLowerCase(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding service:", error);
      throw new Error("Failed to add service");
    }
  },

  /**
   * Update service
   * @param {string} serviceId - ID of service to update
   * @param {object} updateData - Data to update
   * @returns {Promise<void>}
   */
  updateService: async (serviceId, updateData) => {
    try {
      if (!serviceId) throw new Error("Service ID is required");
      
      const serviceRef = doc(db, 'services', serviceId);
      
      // Remove fields that shouldn't be updated
      const { id, userId, createdAt, ...dataToUpdate } = updateData;
      
      await updateDoc(serviceRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error("Failed to update service");
    }
  },

  /**
   * Update service rating
   * @param {string} serviceId - ID of service
   * @param {number} newRating - New rating (1-5)
   * @returns {Promise<void>}
   */
  updateRating: async (serviceId, newRating) => {
    try {
      if (!serviceId) throw new Error("Service ID is required");
      if (newRating < 1 || newRating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, {
        rating: newRating,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      throw new Error("Failed to update rating");
    }
  },

  /**
   * Delete service
   * @param {string} serviceId - ID of service to delete
   * @returns {Promise<void>}
   */
  deleteService: async (serviceId) => {
    try {
      if (!serviceId) throw new Error("Service ID is required");
      
      const serviceRef = doc(db, 'services', serviceId);
      await deleteDoc(serviceRef);
    } catch (error) {
      console.error("Error deleting service:", error);
      throw new Error("Failed to delete service");
    }
  },

  /**
   * Get single service
   * @param {string} serviceId - ID of service to fetch
   * @returns {Promise<object>} Service object
   */
  getService: async (serviceId) => {
    try {
      if (!serviceId) throw new Error("Service ID is required");
      
      const serviceRef = doc(db, 'services', serviceId);
      const docSnap = await getDoc(serviceRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error("Service not found");
      }
    } catch (error) {
      console.error("Error getting service:", error);
      throw new Error("Failed to fetch service");
    }
  },

  /**
   * Search services
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching services
   */
  searchServices: async (searchTerm) => {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a workaround - for production, consider using Algolia or similar
      const allServices = await serviceService.getAllServices();
      const searchLower = searchTerm.toLowerCase();
      
      return allServices.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower) ||
        service.city.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error("Error searching services:", error);
      throw new Error("Failed to search services");
    }
  }
};

// ==================== USER PROFILE SERVICES ====================

export const userService = {
  /**
   * Get user profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} User profile or null
   */
  getUserProfile: async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  },

  /**
   * Create user profile
   * @param {string} userId - User ID
   * @param {object} profileData - Profile data
   * @returns {Promise<string>} Document ID
   */
  createUserProfile: async (userId, profileData) => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const usersRef = collection(db, 'users');
      const docRef = await addDoc(usersRef, {
        uid: userId,
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Failed to create user profile");
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {object} profileData - Profile data to update
   * @returns {Promise<void>}
   */
  updateUserProfile: async (userId, profileData) => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);
        
        // Remove fields that shouldn't be updated
        const { uid, createdAt, ...dataToUpdate } = profileData;
        
        await updateDoc(userRef, {
          ...dataToUpdate,
          updatedAt: serverTimestamp()
        });
      } else {
        throw new Error("User profile not found");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update profile");
    }
  },

  /**
   * Delete user profile
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  deleteUserProfile: async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);
        await deleteDoc(userRef);
      }
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw new Error("Failed to delete profile");
    }
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get user-friendly error message from Firebase auth error code
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/weak-password': 'Password is too weak',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/requires-recent-login': 'Please log in again to perform this action'
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again';
}

/**
 * Export all services
 */
export default {
  authService,
  storageService,
  serviceService,
  userService
};