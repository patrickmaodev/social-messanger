/**
 * Custom hooks for API data fetching with React Query
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { UseApiOptions } from '@/types';

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  friends: (userId: number) => ['friends', userId] as const,
  friendRequests: (userId: number) => ['friendRequests', userId] as const,
  messages: (senderId: number, recipientId: number) => ['messages', senderId, recipientId] as const,
  conversations: (userId: number) => ['conversations', userId] as const,
};

// User Hooks
export const useUsers = (options?: UseApiOptions) => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.get('/users/users/'),
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
  });
};

export const useUser = (id: number, options?: UseApiOptions) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiClient.get(`/users/users/${id}/profile/`),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });
};

// Friend Hooks
export const useFriends = (userId: number, options?: UseApiOptions) => {
  return useQuery({
    queryKey: queryKeys.friends(userId),
    queryFn: () => apiClient.get(`/friends/friend-requests/friends/${userId}/`),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 minutes
  });
};

export const useFriendRequests = (userId: number, options?: UseApiOptions) => {
  return useQuery({
    queryKey: queryKeys.friendRequests(userId),
    queryFn: () => apiClient.get('/friends/friend-requests/'),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 1 * 60 * 1000, // 1 minute
  });
};

// Message Hooks
export const useMessages = (senderId: number, recipientId: number, options?: UseApiOptions) => {
  return useQuery({
    queryKey: queryKeys.messages(senderId, recipientId),
    queryFn: () => apiClient.get(`/messages/messages/${senderId}/${recipientId}/`),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // Refetch every 10 seconds for real-time feel
  });
};

export const useConversations = (userId: number, options?: UseApiOptions) => {
  return useQuery({
    queryKey: queryKeys.conversations(userId),
    queryFn: () => apiClient.get(`/messages/messages/chats/${userId}/`),
    enabled: options?.enabled ?? true,
    retry: options?.retry ?? 3,
    staleTime: options?.staleTime ?? 1 * 60 * 1000, // 1 minute
  });
};

// Mutation Hooks
export const useSendMessage = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageData: any) => apiClient.post('/messages/messages/', messageData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch messages for this conversation
      const { sender, recipient } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(sender, recipient),
      });
      
      // Invalidate conversations
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations(sender),
      });
    },
    onError: options?.onError,
  });
};

export const useSendFriendRequest = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { receiver: number }) => apiClient.post('/friends/friend-requests/', data),
    onSuccess: () => {
      // Invalidate friend requests
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
      });
    },
    onError: options?.onError,
  });
};

export const useAcceptFriendRequest = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { selected_user_id: number }) => 
      apiClient.post('/friends/friend-requests/accept/', data),
    onSuccess: () => {
      // Invalidate friend requests and friends
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
      });
      queryClient.invalidateQueries({
        queryKey: ['friends'],
      });
    },
    onError: options?.onError,
  });
};

export const useCancelFriendRequest = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { selected_user_id: number }) => 
      apiClient.post('/friends/friend-requests/cancel/', data),
    onSuccess: () => {
      // Invalidate friend requests
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
      });
    },
    onError: options?.onError,
  });
};

export const useRemoveFriend = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { selected_user_id: number }) => 
      apiClient.post('/friends/friend-requests/remove/', data),
    onSuccess: () => {
      // Invalidate friends
      queryClient.invalidateQueries({
        queryKey: ['friends'],
      });
    },
    onError: options?.onError,
  });
};

export const useDeleteMessages = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { messages: number[] }) => 
      apiClient.post('/messages/messages/delete/', data),
    onSuccess: () => {
      // Invalidate all message queries
      queryClient.invalidateQueries({
        queryKey: ['messages'],
      });
    },
    onError: options?.onError,
  });
};

// Utility hooks
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    invalidateFriends: () => queryClient.invalidateQueries({ queryKey: ['friends'] }),
    invalidateMessages: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
    invalidateConversations: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  };
};
