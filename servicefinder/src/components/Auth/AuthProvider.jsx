import { createContext, useContext, useState, useEffect } from "react";
import { authService, userService } from "../../firebase/firebaseServices";

// Create Auth context
const AuthContext = createContext();

/**
 * Custom hook to use Auth Context
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 * Manages Authentication state and provides auth methods to children
 */
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch user profile from Firestore
   * @param {string} userId - User ID
   */
  const fetchUserProfile = async (userId) => {
    try {
      const profile = await userService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in existing user
   */
  const signIn = async (email, password) => {
    try {
      setError(null);
      const user = await authService.signIn(email, password);
      await fetchUserProfile(user.uid);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (email, password, additionalData = {}) => {
    try {
      setError(null);
      const user = await authService.signUp(email, password, additionalData);
      await fetchUserProfile(user.uid);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Sign out current user
   */
  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update user profile
   */
  const updateUserProfile = async (profileData) => {
    try {
      if (!currentUser) throw new Error('No user is currently signed in');
      setError(null);
      await userService.updateUserProfile(currentUser.uid, profileData);
      await fetchUserProfile(currentUser.uid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearError = () => setError(null);
  const isAuthenticated = () => currentUser !== null;
  const getDisplayName = () => {
    if (!currentUser) return '';
    return currentUser.displayName || userProfile?.displayName || currentUser.email?.split('@')[0] || 'User';
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    clearError,
    isAuthenticated,
    getDisplayName,
    refreshProfile: () => currentUser && fetchUserProfile(currentUser.uid)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;