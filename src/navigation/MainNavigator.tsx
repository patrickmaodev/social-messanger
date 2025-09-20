/**
 * Main App Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '@/types';
import { ChatScreen } from '@/screens/chat/ChatScreen';
import { FriendsScreen } from '@/screens/friends/FriendsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { ChatMessageScreen } from '@/screens/chat/ChatMessageScreen';
import { UserDiscoveryScreen } from '@/screens/friends/UserDiscoveryScreen';
import { FriendRequestsScreen } from '@/screens/friends/FriendRequestsScreen';
import { PendingRequestsScreen } from '@/screens/friends/PendingRequestsScreen';
import { UI_CONSTANTS } from '@/config/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: UI_CONSTANTS.COLORS.PRIMARY,
        tabBarInactiveTintColor: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: UI_CONSTANTS.COLORS.WHITE,
          borderTopWidth: 0,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: UI_CONSTANTS.COLORS.BLACK,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 8,
        },
        headerStyle: {
          backgroundColor: UI_CONSTANTS.COLORS.WHITE,
          borderBottomWidth: 1,
          borderBottomColor: UI_CONSTANTS.COLORS.BORDER,
        },
        headerTintColor: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
        headerTitleStyle: {
          fontWeight: '600',
          color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
        },
      })}
    >
      <Tab.Screen
        name="Chats"
        component={ChatScreen}
        options={{ title: 'Chats' }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
        },
        headerTintColor: UI_CONSTANTS.COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatMessage"
        component={ChatMessageScreen}
        options={({ route }) => ({
          title: route.params?.recipientName || 'Chat',
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name="UserDiscovery"
        component={UserDiscoveryScreen}
        options={{
          title: 'Discover Users',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="FriendRequests"
        component={FriendRequestsScreen}
        options={{
          title: 'Friend Requests',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="PendingRequests"
        component={PendingRequestsScreen}
        options={{
          title: 'Pending Requests',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};
