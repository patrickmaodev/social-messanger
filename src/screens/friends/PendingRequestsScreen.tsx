/**
 * Pending Requests Screen - View sent friend requests
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
import { useFriendRequests, useCancelFriendRequest } from '@/hooks/useApi';
import { UI_CONSTANTS } from '@/config/constants';

interface PendingRequest {
  requestId: number;
  receiverId: number;
  name: string;
  email: string;
  image?: string;
  status: string;
}

export const PendingRequestsScreen: React.FC = () => {
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

  const cancelFriendRequestMutation = useCancelFriendRequest();

  // Filter for sent requests that are still pending
  const pendingRequests: PendingRequest[] = friendRequestsData?.sentRequests?.filter(
    (request: any) => request.status === 'pending'
  ) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing pending requests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelRequest = (request: PendingRequest) => {
    Alert.alert(
      'Cancel Friend Request',
      `Are you sure you want to cancel the friend request to ${request.name}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelFriendRequestMutation.mutateAsync({
                selected_user_id: request.receiverId,
              });
              Alert.alert('Success', 'Friend request cancelled');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel friend request');
            }
          },
        },
      ]
    );
  };

  const renderPendingRequest = ({ item }: { item: PendingRequest }) => (
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
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
          <Text style={styles.statusSubtext}>Waiting for response</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleCancelRequest(item)}
        disabled={cancelFriendRequestMutation.isPending}
      >
        <Ionicons
          name="close-circle-outline"
          size={24}
          color={UI_CONSTANTS.COLORS.DANGER}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="time-outline"
        size={64}
        color={UI_CONSTANTS.COLORS.LIGHT}
      />
      <Text style={styles.emptyTitle}>No Pending Requests</Text>
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
        renderItem={renderPendingRequest}
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
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: UI_CONSTANTS.COLORS.WARNING,
    paddingHorizontal: UI_CONSTANTS.SPACING.SM,
    paddingVertical: UI_CONSTANTS.SPACING.XS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  statusText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.WHITE,
  },
  statusSubtext: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    color: UI_CONSTANTS.COLORS.DARK,
    opacity: 0.7,
  },
  cancelButton: {
    padding: UI_CONSTANTS.SPACING.SM,
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
