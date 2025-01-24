import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const RequestedScreen = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchIncomingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://192.168.1.3:8000/requested-friends-requests/${user.userId}`);
        console.log(response.data.friendRequests);
      setRequests(response.data.friendRequests);
    } catch (err) {
      Alert.alert("Unable to fetch incoming requests.");
    } finally {
      setLoading(false);
    }
  };

  // Accept Friend Request
  const acceptFriendRequest = async (selectedUserId) => {
    try {
      const response = await axios.post("http://192.168.1.3:8000/accept-friend-request", {
        currentUserId: user.userId,
        selectedUserId,
      });
      fetchIncomingRequests();
    } catch (error) {
      Alert.alert("Error", "Unable to accept the friend request. Please try again.");
    }
  };

  const removeFriendRequest = async (selectedUserId) => {
    try {
      const response = await axios.post("http://192.168.1.3:8000/remove-friend", {
        currentUserId: user.userId,
        selectedUserId,
      });
      fetchIncomingRequests();
    } catch (error) {
      Alert.alert("Error", "Unable to remove accepted friend. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const navigateToFindFriends = () => {
    navigation.navigate("Home");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userListContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : requests.length > 0 ? (
          requests.map((request, index) => (
            <View key={index} style={styles.userItem}>
              <View style={styles.userInfoContainer}>
                <View style={styles.userImageContainer}>
                  <Image source={{ uri: request.image }} style={styles.userImage} />
                </View>
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>{request.name}</Text>
                  <Text>{request.email}</Text>
                  <View style={styles.statusContainer}>
                    {request.status === 'accepted' ? (
                      <TouchableOpacity
                        style={styles.statusContainer}
                        onPress={() => removeFriendRequest(request.senderId)}
                      >
                        <Text style={styles.statusText}>Friend</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.statusContainer}
                        onPress={() => acceptFriendRequest(request.senderId)}
                      >
                        <Text style={styles.statusText}>Accept</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noRequestsContainer}>
            <Image
              source={require('../assets/empty.jpg')}
              style={styles.noRequestsImage}
            />
            <Text style={styles.noRequestsText}>No incoming requests found.</Text>
            <Text style={styles.emptyDescription}>
              You haven’t received any friend requests yet. Start connecting with others now!
            </Text>
            <TouchableOpacity style={styles.findFriendsButton} onPress={navigateToFindFriends}>
              <Text style={styles.findFriendsButtonText}>Find Friends</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
  
  
};

export default RequestedScreen;

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
  },
  userImageContainer: {
    width: 100,
    height: 100,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  userTextContainer: {
    marginLeft: 16,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    backgroundColor: '#e0e0e0',
    color: '#757575',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noRequestsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  noRequestsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noRequestsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: "center",
    fontSize: 14,
    color: "#757575",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  findFriendsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  findFriendsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
});
