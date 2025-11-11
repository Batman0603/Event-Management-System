import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getMyProfile } from '../services/userService';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const { user: authUser, loading: authLoading } = useAuth(); // Get user from AuthContext

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      const response = await getMyProfile();
      setUser(response.data); // The user object is in response.data
      setUserError(null);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setUserError(err.message || 'Failed to fetch profile.');
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    // Fetch user data only when the authentication is confirmed and there's a user
    if (!authLoading && authUser) {
      fetchCurrentUser();
    } else if (!authLoading && !authUser) {
      // If user is logged out, clear user data and stop loading
      setUser(null);
      setLoadingUser(false);
    }
  }, [authUser, authLoading, fetchCurrentUser]);

  const value = { user, loadingUser, userError, fetchCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};