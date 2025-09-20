/**
 * Chat Message Screen - Individual conversation view
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useMessages, useSendMessage } from '@/hooks/useApi';
import { RootStackParamList, Message } from '@/types';
import { UI_CONSTANTS } from '@/config/constants';

type ChatMessageScreenRouteProp = RouteProp<RootStackParamList, 'ChatMessage'>;

export const ChatMessageScreen: React.FC = () => {
  const route = useRoute<ChatMessageScreenRouteProp>();
  const { recipientId, recipientName } = route.params;
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useMessages(user?.id || 0, recipientId, {
    enabled: !!user?.id,
  });

  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) {
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        sender: user.id,
        recipient: recipientId,
        message_type: 'text',
        content: messageText.trim(),
      });

      setMessageText('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender.id === user?.id;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {formatMessageTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.recipientInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {recipientName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.recipientName}>{recipientName}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubble-outline"
        size={48}
        color={UI_CONSTANTS.COLORS.LIGHT}
      />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>
        Start the conversation with {recipientName}
      </Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={UI_CONSTANTS.COLORS.DANGER}
        />
        <Text style={styles.errorTitle}>Error Loading Messages</Text>
        <Text style={styles.errorMessage}>
          {error.message || 'Something went wrong'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={messages || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder={`Message ${recipientName}...`}
            placeholderTextColor={UI_CONSTANTS.COLORS.DARK}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
            editable={!sendMessageMutation.isPending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!messageText.trim() || sendMessageMutation.isPending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                messageText.trim() && !sendMessageMutation.isPending
                  ? UI_CONSTANTS.COLORS.WHITE
                  : UI_CONSTANTS.COLORS.LIGHT
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONSTANTS.COLORS.LIGHT,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  avatarText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  recipientName: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
  },
  messagesList: {
    flexGrow: 1,
    padding: UI_CONSTANTS.SPACING.MD,
  },
  messageContainer: {
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
  },
  ownBubble: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderBottomRightRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
  },
  otherBubble: {
    backgroundColor: UI_CONSTANTS.COLORS.LIGHT,
    borderBottomLeftRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
  },
  messageText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    lineHeight: 20,
  },
  ownMessageText: {
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  otherMessageText: {
    color: UI_CONSTANTS.COLORS.DARK,
  },
  timestamp: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    marginTop: UI_CONSTANTS.SPACING.XS,
  },
  ownTimestamp: {
    color: UI_CONSTANTS.COLORS.WHITE,
    opacity: 0.8,
  },
  otherTimestamp: {
    color: UI_CONSTANTS.COLORS.DARK,
    opacity: 0.6,
  },
  inputContainer: {
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: UI_CONSTANTS.COLORS.LIGHT,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: UI_CONSTANTS.COLORS.LIGHT,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
  },
  textInput: {
    flex: 1,
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.DARK,
    maxHeight: 100,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
  },
  sendButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.ROUND,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: UI_CONSTANTS.SPACING.SM,
  },
  sendButtonDisabled: {
    backgroundColor: UI_CONSTANTS.COLORS.LIGHT,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.LG,
  },
  emptyText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginTop: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  emptySubtext: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.DARK,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.LG,
  },
  errorTitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DANGER,
    marginTop: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  errorMessage: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.DARK,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  retryButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  retryButtonText: {
    color: UI_CONSTANTS.COLORS.WHITE,
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
  },
});
