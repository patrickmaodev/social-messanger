/**
 * Message Store using Zustand
 * Manages messages and conversations state
 */

import { create } from 'zustand';
import { Message, Conversation, MessageState } from '@/types';
import { apiClient } from '@/services/apiClient';

interface MessageStore extends MessageState {
  // Actions
  fetchMessages: (senderId: number, recipientId: number) => Promise<void>;
  sendMessage: (messageData: any) => Promise<Message>;
  fetchConversations: (userId: number) => Promise<void>;
  markMessageAsRead: (messageId: number) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  deleteMessages: (messageIds: number[]) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: number, updates: Partial<Message>) => void;
  removeMessage: (messageId: number) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  // Initial state
  messages: [],
  conversations: [],
  isLoading: false,
  error: null,

  // Actions
  fetchMessages: async (senderId: number, recipientId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const messages: Message[] = await apiClient.get(
        `/messages/messages/${senderId}/${recipientId}/`
      );
      
      set({ messages, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch messages',
      });
      throw error;
    }
  },

  sendMessage: async (messageData: any) => {
    try {
      const message: Message = await apiClient.post('/messages/messages/', messageData);
      
      // Add message to local state
      set((state) => ({
        messages: [...state.messages, message],
      }));
      
      return message;
    } catch (error: any) {
      set({ error: error.message || 'Failed to send message' });
      throw error;
    }
  },

  fetchConversations: async (userId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get(`/messages/messages/chats/${userId}/`);
      const messages: Message[] = response.messages || [];
      
      // Group messages by conversation
      const conversations = get().groupMessagesByConversation(messages, userId);
      
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch conversations',
      });
      throw error;
    }
  },

  markMessageAsRead: async (messageId: number) => {
    try {
      await apiClient.patch(`/messages/messages/${messageId}/mark-read/`);
      
      // Update local state
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        ),
        conversations: state.conversations.map((conv) => ({
          ...conv,
          unreadCount: conv.participant.id === get().getMessageById(messageId)?.recipient.id 
            ? Math.max(0, conv.unreadCount - 1) 
            : conv.unreadCount,
        })),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to mark message as read' });
      throw error;
    }
  },

  deleteMessage: async (messageId: number) => {
    try {
      await apiClient.delete(`/messages/messages/${messageId}/`);
      
      // Remove from local state
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== messageId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete message' });
      throw error;
    }
  },

  deleteMessages: async (messageIds: number[]) => {
    try {
      await apiClient.post('/messages/messages/delete/', { messages: messageIds });
      
      // Remove from local state
      set((state) => ({
        messages: state.messages.filter((msg) => !messageIds.includes(msg.id)),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete messages' });
      throw error;
    }
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (messageId: number, updates: Partial<Message>) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  },

  removeMessage: (messageId: number) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    }));
  },

  clearMessages: () => {
    set({ messages: [], conversations: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // Helper methods
  groupMessagesByConversation: (messages: Message[], currentUserId: number): Conversation[] => {
    const conversationMap = new Map<string, Conversation>();

    messages.forEach((message) => {
      const otherUser = message.sender.id === currentUserId ? message.recipient : message.sender;
      const conversationId = `${Math.min(message.sender.id, message.recipient.id)}-${Math.max(message.sender.id, message.recipient.id)}`;

      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          id: conversationId,
          participant: otherUser,
          lastMessage: undefined,
          unreadCount: 0,
          updatedAt: message.created_at,
        });
      }

      const conversation = conversationMap.get(conversationId)!;
      
      // Update last message if this is more recent
      if (!conversation.lastMessage || new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.created_at;
      }

      // Count unread messages
      if (!message.is_read && message.recipient.id === currentUserId) {
        conversation.unreadCount++;
      }
    });

    return Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getMessageById: (messageId: number): Message | undefined => {
    return get().messages.find((msg) => msg.id === messageId);
  },
}));
