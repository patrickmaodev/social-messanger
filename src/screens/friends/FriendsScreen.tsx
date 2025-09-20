/**
 * Friends Screen - Lists friends and pending requests
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { useFriends, useRemoveFriend } from '@/hooks/useApi';
import { RootStackParamList, User } from '@/types';
import { UI_CONSTANTS } from '@/config/constants';

type FriendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const FriendsScreen: React.FC = () => {
  const navigation = useNavigation<FriendsScreenNavigationProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: friendsData,
    isLoading,
    error,
    refetch,
  } = useFriends(user?.id || 0, {
    enabled: !!user?.id,
  });

  const removeFriendMutation = useRemoveFriend();

  const friends: User[] = friendsData?.friends || [];
  const pendingRequests = friendsData?.pendingRequests || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing friends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFriendPress = (friend: User) => {
    navigation.navigate('ChatMessage', {
      recipientId: friend.id,
      recipientName: friend.full_name,
    });
  };

  const handleRemoveFriend = (friend: User) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend.full_name} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFriendMutation.mutateAsync({
                selected_user_id: friend.id,
              });
              Alert.alert('Success', 'Friend removed successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove friend');
            }
          },
        },
      ]
    );
  };

  const handlePendingRequestPress = (request: any) => {
    navigation.navigate('FriendRequests');
  };

  const renderFriend = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleFriendPress(item)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.full_name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.friendContent}>
        <Text style={styles.friendName} numberOfLines={1}>
          {item.full_name}
        </Text>
        <Text style={styles.friendEmail} numberOfLines={1}>
          {item.email}
        </Text>
      </View>

      <View style={styles.friendActions}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleFriendPress(item)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={UI_CONSTANTS.COLORS.PRIMARY}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFriend(item)}
        >
          <Ionicons
            name="person-remove-outline"
            size={20}
            color={UI_CONSTANTS.COLORS.DANGER}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPendingRequest = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.pendingItem}
      onPress={() => handlePendingRequestPress(item)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.pendingContent}>
        <Text style={styles.pendingName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.pendingEmail} numberOfLines={1}>
          {item.email}
        </Text>
      </View>

      <View style={styles.pendingBadge}>
        <Text style={styles.pendingBadgeText}>Pending</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
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
      <Text style={styles.emptyTitle}>No Friends Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start by discovering and adding friends
      </Text>
      <TouchableOpacity
        style={styles.discoverButton}
        onPress={() => navigation.navigate('UserDiscovery')}
      >
        <Text style={styles.discoverButtonText}>Discover Users</Text>
      </TouchableOpacity>
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
        <Text style={styles.errorTitle}>Error Loading Friends</Text>
        <Text style={styles.errorMessage}>
          {error.message || 'Something went wrong'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderContent = () => {
    if (friends.length === 0 && pendingRequests.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={[
          { type: 'pending', data: pendingRequests },
          { type: 'friends', data: friends },
        ]}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={({ item }) => (
          <View>
            {item.type === 'pending' && item.data.length > 0 && (
              <>
                {renderSectionHeader('Pending Requests', item.data.length)}
                <FlatList
                  data={item.data}
                  keyExtractor={(pendingItem) => pendingItem.requestId.toString()}
                  renderItem={renderPendingRequest}
                  scrollEnabled={false}
                />
              </>
            )}
            {item.type === 'friends' && item.data.length > 0 && (
              <>
                {renderSectionHeader('Friends', item.data.length)}
                <FlatList
                  data={item.data}
                  keyExtractor={(friend) => friend.id.toString()}
                  renderItem={renderFriend}
                  scrollEnabled={false}
                />
              </>
            )}
          </View>
        )}
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
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.discoverButton}
          onPress={() => navigation.navigate('UserDiscovery')}
        >
          <Ionicons
            name="person-add-outline"
            size={20}
            color={UI_CONSTANTS.COLORS.WHITE}
          />
          <Text style={styles.discoverButtonText}>Discover</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  discoverButtonText: {
    color: UI_CONSTANTS.COLORS.WHITE,
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    marginLeft: UI_CONSTANTS.SPACING.XS,
  },
  listContainer: {
    padding: UI_CONSTANTS.SPACING.MD,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.MD,
    marginTop: UI_CONSTANTS.SPACING.LG,
  },
  sectionTitle: {
    fontSize: UI_CONSTANTS.FONT_SIZES.LG,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
  },
  countBadge: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.ROUND,
    paddingHorizontal: UI_CONSTANTS.SPACING.SM,
    paddingVertical: UI_CONSTANTS.SPACING.XS,
  },
  countText: {
    color: UI_CONSTANTS.COLORS.WHITE,
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    fontWeight: '600',
  },
  friendItem: {
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
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.LIGHT,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
    borderLeftWidth: 4,
    borderLeftColor: UI_CONSTANTS.COLORS.WARNING,
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
  friendContent: {
    flex: 1,
  },
  pendingContent: {
    flex: 1,
  },
  friendName: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  friendEmail: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.DARK,
  },
  pendingName: {
    fontSize: UI_CONSTANTS.FONT_SIZES.MD,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.DARK,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  pendingEmail: {
    fontSize: UI_CONSTANTS.FONT_SIZES.SM,
    color: UI_CONSTANTS.COLORS.DARK,
  },
  friendActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButton: {
    padding: UI_CONSTANTS.SPACING.SM,
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  removeButton: {
    padding: UI_CONSTANTS.SPACING.SM,
  },
  pendingBadge: {
    backgroundColor: UI_CONSTANTS.COLORS.WARNING,
    paddingHorizontal: UI_CONSTANTS.SPACING.SM,
    paddingVertical: UI_CONSTANTS.SPACING.XS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
  },
  pendingBadgeText: {
    fontSize: UI_CONSTANTS.FONT_SIZES.XS,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.WHITE,
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
    marginBottom: UI_CONSTANTS.SPACING.LG,
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
