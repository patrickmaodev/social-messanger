/**
 * Profile Screen - User profile and settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { UI_CONSTANTS } from '@/config/constants';
import { SocialModal } from '@/components/ui/SocialModal';
import { useSocialModal } from '@/hooks/useSocialModal';
import { BaseScreen } from '@/components/common/BaseScreen';
import { ScreenContent } from '@/components/common/ScreenContent';
import { ContentSection } from '@/components/common/ContentSection';
import { MenuItem } from '@/components/common/MenuItem';
import { NetworkDiagnostic } from '@/components/common/NetworkDiagnostic';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNetworkDiagnostic, setShowNetworkDiagnostic] = useState(false);
  const { modalConfig, isVisible, showModal, hideModal, handleConfirm, handleCancel } = useSocialModal();

  const handleLogout = () => {
    showModal({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      type: 'warning',
      icon: 'log-out-outline',
      confirmText: 'Logout',
      onConfirm: async () => {
        setIsLoggingOut(true);
        try {
          await logout();
        } catch (error) {
          console.error('Logout error:', error);
          showModal({
            title: 'Logout Failed',
            message: 'Failed to logout. Please try again.',
            type: 'error',
            icon: 'alert-circle-outline',
            showCancel: false,
          });
        } finally {
          setIsLoggingOut(false);
        }
      },
    });
  };

  const handleEditProfile = () => {
    showModal({
      title: 'Edit Profile',
      message: 'Profile editing feature coming soon!',
      type: 'info',
      icon: 'person-outline',
      showCancel: false,
    });
  };

  const handleChangePassword = () => {
    showModal({
      title: 'Change Password',
      message: 'Password change feature coming soon!',
      type: 'info',
      icon: 'lock-closed-outline',
      showCancel: false,
    });
  };

  const handleNotifications = () => {
    showModal({
      title: 'Notifications',
      message: 'Notification settings coming soon!',
      type: 'info',
      icon: 'notifications-outline',
      showCancel: false,
    });
  };

  const handlePrivacy = () => {
    showModal({
      title: 'Privacy',
      message: 'Privacy settings coming soon!',
      type: 'info',
      icon: 'shield-checkmark-outline',
      showCancel: false,
    });
  };

  const handleHelp = () => {
    showModal({
      title: 'Help & Support',
      message: 'Help center coming soon!',
      type: 'info',
      icon: 'help-circle-outline',
      showCancel: false,
    });
  };

  const handleAbout = () => {
    showModal({
      title: 'About',
      message: 'Social Messenger v1.0.0\n\nA modern social messaging application built with React Native and Django.',
      type: 'info',
      icon: 'information-circle-outline',
      showCancel: false,
    });
  };


  return (
    <BaseScreen>
      <ScreenContent>
        {/* Profile Header */}
        <ContentSection title="Profile">
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.profile_picture ? (
                <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.verificationBadge}>
              <Ionicons
                name={user?.is_verified ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={user?.is_verified ? UI_CONSTANTS.COLORS.SUCCESS : UI_CONSTANTS.COLORS.DANGER}
              />
              <Text style={[
                styles.verificationText,
                { color: user?.is_verified ? UI_CONSTANTS.COLORS.SUCCESS : UI_CONSTANTS.COLORS.DANGER }
              ]}>
                {user?.is_verified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>
        </ContentSection>

        {/* Account Settings */}
        <ContentSection title="Account">
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            onPress={handleEditProfile}
          />
          <MenuItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={handleChangePassword}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={handleNotifications}
          />
        </ContentSection>

        {/* Privacy & Security */}
        <ContentSection title="Privacy & Security">
          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy"
            onPress={handlePrivacy}
          />
        </ContentSection>

        {/* Support */}
        <ContentSection title="Support">
          <MenuItem
            icon="wifi-outline"
            title="Network Diagnostics"
            subtitle="Test backend connectivity"
            onPress={() => setShowNetworkDiagnostic(true)}
          />
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={handleHelp}
          />
          <MenuItem
            icon="information-circle-outline"
            title="About"
            onPress={handleAbout}
          />
        </ContentSection>

        {/* Account Actions */}
        <ContentSection title="Account Actions">
          <MenuItem
            icon="log-out-outline"
            title={isLoggingOut ? 'Logging out...' : 'Logout'}
            onPress={handleLogout}
            disabled={isLoggingOut}
            variant="danger"
            showArrow={false}
          />
        </ContentSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Social Messenger v1.0.0</Text>
          <Text style={styles.footerText}>Made with React Native</Text>
        </View>
      </ScreenContent>

      {modalConfig && (
        <SocialModal
          visible={isVisible}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          showCancel={modalConfig.showCancel}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          icon={modalConfig.icon}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={hideModal}
        />
      )}

      {showNetworkDiagnostic && (
        <NetworkDiagnostic />
      )}
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.LG,
  },
  avatarContainer: {
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XXL,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  userName: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XL,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  userEmail: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    paddingHorizontal: UI_CONSTANTS.SPACING.SM,
    paddingVertical: UI_CONSTANTS.SPACING.XS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  verificationText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    fontWeight: '500',
    marginLeft: UI_CONSTANTS.SPACING.XS,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.XL,
    marginTop: UI_CONSTANTS.SPACING.LG,
  },
  footerText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
});
