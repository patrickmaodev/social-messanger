/**
 * User Discovery Screen - Find and add new friends
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useUsers, useSendFriendRequest } from '@/hooks/useApi';
import { User } from '@/types';
import { UI_CONSTANTS } from '@/config/constants';

export const UserDiscoveryScreen: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useUsers({
    enabled: !!user?.id,
  });

  const sendFriendRequestMutation = useSendFriendRequest();

  const filteredUsers = users?.filter((u: User) => {
    if (u.id === user?.id) return false;
    if (!searchQuery) return true;
    return (
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const handleSendFriendRequest = async (targetUser: User) => {
    try {
      await sendFriendRequestMutation.mutateAsync({
        receiver: targetUser.id,
      });
      Alert.alert(
        'Friend Request Sent',
        `Friend request sent to ${targetUser.full_name}`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send friend request');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.full_name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.userContent}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.full_name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <Text style={styles.userStatus}>
          {item.is_verified ? 'Verified' : 'Unverified'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleSendFriendRequest(item)}
        disabled={sendFriendRequestMutation.isPending}
      >
        <Ionicons
          name="person-add-outline"
          size={20}
          color={UI_CONSTANTS.COLORS.WHITE}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="search-outline"
        size={64}
        color={UI_CONSTANTS.COLORS.LIGHT}
      />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No Users Found' : 'No Users Available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'There are no other users to discover'}
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
        <Text style={styles.errorTitle}>Error Loading Users</Text>
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={20}
            color={UI_CONSTANTS.COLORS.DARK}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            placeholderTextColor={UI_CONSTANTS.COLORS.DARK}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={UI_CONSTANTS.COLORS.DARK}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[UI_CONSTANTS.COLORS.PRIMARY]}
            tintColor={UI_CONSTANTS.COLORS.PRIMARY}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
  },
  searchContainer: {
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONSTANTS.COLORS.LIGHT,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
  },
  searchIcon: {
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  searchInput: {
    flex: 1,
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    color: UI_CONSTANTS.COLORS.DARK,
  },
  clearButton: {
    padding: UI_CONSTANTS.SPACING.XS,
  },
  listContainer: {
    padding: UI_CONSTANTS.SPACING.MD,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
    shadowColor: UI_CONSTANTS.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: UI_CONSTANTS.SPACING.MD,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  userContent: {
    flex: 1,
  },
  userName: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  userEmail: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  userStatus: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    color: UI_CONSTANTS.COLORS.SUCCESS,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.ROUND,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.LG,
  },
  emptyTitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginTop: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  emptySubtitle: {
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
