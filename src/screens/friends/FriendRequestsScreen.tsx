/**
 * Friend Requests Screen - Manage incoming friend requests
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useFriendRequests, useAcceptFriendRequest } from '@/hooks/useApi';
import { UI_CONSTANTS } from '@/config/constants';

interface FriendRequest {
  requestId: number;
  senderId: number;
  name: string;
  email: string;
  image?: string;
}

export const FriendRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: friendRequestsData,
    isLoading,
    error,
    refetch,
  } = useFriendRequests(user?.id || 0, {
    enabled: !!user?.id,
  });

  const acceptFriendRequestMutation = useAcceptFriendRequest();

  const pendingRequests: FriendRequest[] = friendRequestsData?.pendingRequests || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing friend requests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    try {
      await acceptFriendRequestMutation.mutateAsync({
        selected_user_id: request.senderId,
      });
      Alert.alert('Success', `Friend request from ${request.name} accepted!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept friend request');
    }
  };

  const handleRejectRequest = (request: FriendRequest) => {
    Alert.alert(
      'Reject Friend Request',
      `Are you sure you want to reject ${request.name}'s friend request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement reject friend request
            Alert.alert('Info', 'Reject functionality coming soon!');
          },
        },
      ]
    );
  };

  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.requestContent}>
        <Text style={styles.requestName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.requestEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <Text style={styles.requestStatus}>Wants to be your friend</Text>
      </View>

      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item)}
          disabled={acceptFriendRequestMutation.isPending}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={UI_CONSTANTS.COLORS.WHITE}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleRejectRequest(item)}
        >
          <Ionicons
            name="close"
            size={20}
            color={UI_CONSTANTS.COLORS.WHITE}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="people-outline"
        size={64}
        color={UI_CONSTANTS.COLORS.LIGHT}
      />
      <Text style={styles.emptyTitle}>No Friend Requests</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any pending friend requests
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
        <Text style={styles.errorTitle}>Error Loading Requests</Text>
        <Text style={styles.errorMessage}>
          {error.message || 'Something went wrong'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingRequests}
        keyExtractor={(item) => item.requestId.toString()}
        renderItem={renderFriendRequest}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
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
  listContainer: {
    padding: UI_CONSTANTS.SPACING.MD,
  },
  requestItem: {
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
  requestContent: {
    flex: 1,
  },
  requestName: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  requestEmail: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  requestStatus: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.PRIMARY,
    fontWeight: '500',
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: UI_CONSTANTS.COLORS.SUCCESS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.ROUND,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  rejectButton: {
    backgroundColor: UI_CONSTANTS.COLORS.DANGER,
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
