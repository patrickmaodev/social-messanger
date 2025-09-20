/**
 * Authentication hooks
 */

import { useAuthStore } from '@/store/authStore';
import { useCallback } from 'react';
import { UserRegistrationData, UserLoginData } from '@/types';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const handleLogin = useCallback(async (credentials: UserLoginData) => {
    try {
      clearError();
      await login(credentials.email, credentials.password);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    }
  }, [login, clearError, setError]);

  const handleRegister = useCallback(async (userData: UserRegistrationData, autoLogin: boolean = false) => {
    try {
      clearError();
      return await register(userData, autoLogin);
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    }
  }, [register, clearError, setError]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  }, [logout]);

  const handleUpdateUser = useCallback((userData: Partial<typeof user>) => {
    updateUser(userData);
  }, [updateUser]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: handleUpdateUser,
    setLoading,
    setError,
    clearError,
  };
};
