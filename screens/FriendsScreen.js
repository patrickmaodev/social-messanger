import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/config';

const FriendsScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    try {
      if (!user?.userId) return;
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/friends/friends/${user.userId}/`);
      if (response.status === 200) {
        setFriends(response.data.friends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const removeFriendRequest = async (selectedUserId) => {
    try {
      await axios.post(`${API_BASE_URL}/friends/remove-friend/`, {
        currentUserId: user.userId,
        selectedUserId,
      });
      fetchFriends();
    } catch (error) {
      Alert.alert("Error", "Unable to remove friend. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.friendListContainer}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <View key={friend.id} style={styles.friendItem}>
              <View style={styles.friendContent}>
                <Image source={{ uri: friend.image }} style={styles.friendImage} />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendEmail}>{friend.email}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Messages', { recipientId: friend.id })} style={styles.messageButton}>
                <Text style={styles.chatButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFriendRequest(friend.id)} style={styles.removeIcon}>
                <Ionicons name="close" size={30} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.noFriendsContainer}>
            <Text style={styles.noFriendsText}>You have no friends yet.</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Users')}>
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendListContainer: {
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  friendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  friendEmail: {
    fontSize: 12,
    color: '#757575',
  },
  messageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  removeIcon: {
    marginLeft: 10,
  },
  noFriendsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noFriendsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
