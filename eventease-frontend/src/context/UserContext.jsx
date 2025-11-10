import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getMyProfile } from '../services/userService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoadingUser(true);
      const response = await getMyProfile();
      setUser(response.data);
      setUserError(null); // Clear any previous errors on successful fetch
    } catch (err) {
      setUserError(err.message || "Failed to fetch user data.");
      setUser(null); // Clear user if fetch fails
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, userError, fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};