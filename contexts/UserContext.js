import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyToken } from '../constants/config';
import { Alert } from 'react-native';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken) {
          const { isValid } = verifyToken(storedToken);

          if (isValid) {
            setAuthToken(storedToken);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              console.warn("User data missing, but token is valid.");
            }
          } else {
            console.warn("Token is invalid or expired.");
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
          }
        }
      } catch (error) {
        Alert.alert("Error checking authentication status:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token) => {
    const { isValid } = verifyToken(token);

    if (isValid) {
      setUser(userData);
      setAuthToken(token);
      AsyncStorage.setItem('authToken', token);
      AsyncStorage.setItem('user', JSON.stringify(userData));
    } else {
      Alert.alert("Attempted to login with an invalid or expired token.");
    }
  };

  const logout = async () => {
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, authToken, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};


export { UserContext, UserProvider };
