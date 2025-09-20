import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../constants/config';

const UsersScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const userId = user?.userId;

  const fetchData = async () => {
    try {
      const [usersResponse, friendsResponse, pendingResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/auth/users/${userId}/`),
        axios.get(`${API_BASE_URL}/friends/friends/${userId}/`),
        axios.get(`${API_BASE_URL}/friends/requested-friends-requests/${userId}/`),
      ]);

      setUsers(usersResponse.data || []);
      setFriends(friendsResponse.data.friends || []);
      setPendingRequests(pendingResponse.data.friendRequests || []);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId])
  );

  const handleSendRequest = async (selectedUserId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/friends/friend-request/`, {
        currentUserId: userId,
        selectedUserId,
      });

      if (response.status === 201 || response.data.requestStatus === 'pending') {
        setPendingRequests((prevRequests) => [
          ...prevRequests,
          { sender: { id: userId }, receiver: { id: selectedUserId }, requestStatus: 'pending' },
        ]);
      } else if (response.data.requestStatus === 'accepted') {
        setFriends((prevFriends) => [...prevFriends, { _id: selectedUserId }]);
      }

      fetchData();
    } catch (error) {
      console.error('Error while sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (selectedUserId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/friends/accept-friend-request/`, {
        currentUserId: userId,
        selectedUserId,
      });

      if (response.status === 200) {
        setFriends((prevFriends) => [...prevFriends, { _id: selectedUserId }]);
        setPendingRequests((prevRequests) =>
          prevRequests.filter((req) => req.sender.id !== selectedUserId)
        );
        Alert.alert("Success", "Friend request accepted.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to accept the friend request. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userListContainer}>
        {users.length > 0 ? (
          users.map((u) => {
            const isFriend = Array.isArray(friends) && friends.some(friend => friend.id === u.id); 
            const request = pendingRequests.find(
              (req) => req.senderId === u.id || req.receiverId === u.id
            );
            const isPending = Boolean(request);
            const isRequesting = request?.senderId === userId;
            const isRequested = request?.receiverId === userId;

            return (
              <View key={u.id} style={styles.userItem}>
                <View style={styles.userInfoContainer}>
                  <Image source={{ uri: u.image }} style={styles.userImage} />
                  <View style={styles.userTextContainer}>
                    <Text style={styles.userName}>{u.name}</Text>
                    <Text>{u.email}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    {!isFriend && !isPending ? (
                      <TouchableOpacity
                        onPress={() => handleSendRequest(u.id)}
                        style={styles.addButton}>
                        <Text style={styles.addButtonText}>Follow</Text>
                      </TouchableOpacity>
                    ) : isPending ? (
                      isRequesting ? (
                        <TouchableOpacity style={styles.reqButton}>
                          <Text style={styles.reqButtonText}>Requesting...</Text>
                        </TouchableOpacity>
                      ) : isRequested ? (
                        <TouchableOpacity 
                          style={styles.reqButton}
                          onPress={() => acceptFriendRequest(u.id)}
                        >
                          <Text style={styles.reqButtonText}>Accept</Text>
                        </TouchableOpacity>
                      ) : null
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text>No users found</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  userListContainer: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reqButton: {
    backgroundColor: 'darkgrey',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reqButtonText: {
    color: 'black',
    fontWeight: 'bold',
  }
});
