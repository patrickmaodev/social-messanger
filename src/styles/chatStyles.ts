/**
 * Chat-specific styles and color system
 * Ready for future chat implementation
 */

import { StyleSheet } from 'react-native';
import { UI_CONSTANTS, TYPOGRAPHY } from '@/config/constants';

export const CHAT_STYLES = StyleSheet.create({
  // Chat bubble styles
  bubbleContainer: {
    marginVertical: UI_CONSTANTS.SPACING.XS,
    marginHorizontal: UI_CONSTANTS.SPACING.MD,
  },
  
  // Your messages (sent messages)
  yourBubble: {
    backgroundColor: UI_CONSTANTS.COLORS.CHAT_BUBBLE_YOURS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    borderBottomRightRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Other person's messages (received messages)
  otherBubble: {
    backgroundColor: UI_CONSTANTS.COLORS.CHAT_BUBBLE_OTHERS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    borderBottomLeftRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // System/error messages
  systemBubble: {
    backgroundColor: UI_CONSTANTS.COLORS.CHAT_BUBBLE_SYSTEM_ERROR,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    maxWidth: '90%',
    alignSelf: 'center',
    marginVertical: UI_CONSTANTS.SPACING.SM,
  },
  
  // Message text styles
  messageText: {
    ...TYPOGRAPHY.MESSAGE_TEXT,
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  
  yourMessageText: {
    ...TYPOGRAPHY.MESSAGE_TEXT,
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  
  otherMessageText: {
    ...TYPOGRAPHY.MESSAGE_TEXT,
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  
  systemMessageText: {
    ...TYPOGRAPHY.CAPTION,
    color: UI_CONSTANTS.COLORS.ERROR_TEXT,
    textAlign: 'center',
  },
  
  // Timestamp styles
  timestamp: {
    ...TYPOGRAPHY.MESSAGE_TIMESTAMP,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginTop: UI_CONSTANTS.SPACING.XS,
  },
  
  yourTimestamp: {
    textAlign: 'right',
  },
  
  otherTimestamp: {
    textAlign: 'left',
  },
  
  // Online status indicator
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI_CONSTANTS.COLORS.SUCCESS,
    marginRight: UI_CONSTANTS.SPACING.XS,
  },
  
  offlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginRight: UI_CONSTANTS.SPACING.XS,
  },
  
  // Chat input styles
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: UI_CONSTANTS.COLORS.BORDER,
  },
  
  chatInput: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.XL,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    marginRight: UI_CONSTANTS.SPACING.SM,
    maxHeight: 100,
    ...TYPOGRAPHY.BODY_LARGE,
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  
  sendButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.XL,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Dark mode chat bubble adjustments
  darkModeYourBubble: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY, // Blue bubble in dark mode
  },
  
  darkModeOtherBubble: {
    backgroundColor: '#1E293B', // Dark gray bubble in dark mode
  },
  
  darkModeYourText: {
    color: UI_CONSTANTS.COLORS.TEXT_ON_PRIMARY, // White text on blue
  },
  
  darkModeOtherText: {
    color: '#F7FAFC', // Light text on dark gray
  },
});

// Helper functions for chat styling
export const getChatBubbleStyle = (isYourMessage: boolean, isDarkMode: boolean = false) => {
  if (isDarkMode) {
    return isYourMessage ? CHAT_STYLES.darkModeYourBubble : CHAT_STYLES.darkModeOtherBubble;
  }
  return isYourMessage ? CHAT_STYLES.yourBubble : CHAT_STYLES.otherBubble;
};

export const getChatTextStyle = (isYourMessage: boolean, isDarkMode: boolean = false) => {
  if (isDarkMode) {
    return isYourMessage ? CHAT_STYLES.darkModeYourText : CHAT_STYLES.darkModeOtherText;
  }
  return isYourMessage ? CHAT_STYLES.yourMessageText : CHAT_STYLES.otherMessageText;
};

export const getOnlineStatusColor = (isOnline: boolean) => {
  return isOnline ? UI_CONSTANTS.COLORS.SUCCESS : UI_CONSTANTS.COLORS.TEXT_SECONDARY;
};
