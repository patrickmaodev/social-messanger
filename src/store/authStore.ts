/**
 * Authentication Store using Zustand
 * Manages authentication state and user data
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, AuthResponse } from '@/types';
import { apiClient } from '@/services/apiClient';
import { STORAGE_KEYS } from '@/config/constants';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any, autoLogin?: boolean) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await apiClient.post('/users/login/', {
            email,
            password,
          });

          const { access, refresh, user } = response;

          // Store tokens in API client
          apiClient.setAuthToken(access);

          set({
            user,
            token: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (userData: any, autoLogin: boolean = false) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await apiClient.post('/users/register/', userData);

          const { access, refresh, user } = response;

          if (autoLogin) {
            // Store tokens in API client
            apiClient.setAuthToken(access);

            set({
              user,
              token: access,
              refreshToken: refresh,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Just mark as not loading, don't authenticate yet
            set({
              isLoading: false,
              error: null,
            });
          }
          
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Clear tokens from API client
          apiClient.removeAuthToken();
          
          // Clear stored data
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.AUTH_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER_DATA,
          ]);

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      refreshToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response: AuthResponse = await apiClient.post('/users/token/refresh/', {
            refresh: refreshToken,
          });

          const { access } = response;

          // Update token in API client
          apiClient.setAuthToken(access);

          set({
            token: access,
            isAuthenticated: true,
          });
        } catch (error) {
          // Refresh failed, logout user
          await get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
