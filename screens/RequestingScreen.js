import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from '@react-navigation/native';

const RequestingScreen = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchRequestingUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://192.168.1.3:8000/requesting-friends-requests/${user.userId}`
      );
      setRequests(response.data.friendRequests);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const cancelFriendRequest = async (selectedUserId) => {
  
    try {
      const response = await axios.post("http://192.168.1.3:8000/cancel-friend-request", {
        currentUserId: user.userId,
        selectedUserId,
      });
  
      fetchRequestingUsers();
    } catch (error) {
      Alert.alert("Error", "Unable to cancel the friend request. Please try again.");
    }
  };

  useEffect(() => {
    fetchRequestingUsers();
  }, []);

  const navigateToFindFriends = () => {
    navigation.navigate("Home");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userListContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
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
                </View>
                <View style={styles.cancelButtonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelFriendRequest(request.receiverId)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/empty.jpg")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No Requests Sent</Text>
          <Text style={styles.emptyDescription}>
            You haven’t sent any friend requests yet. Start connecting with others now!
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

export default RequestingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  userListContainer: {
    paddingBottom: 20,
  },
  userItem: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImageContainer: {
    width: 50,
    height: 50,
  },
  userImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  userName: {
    fontWeight: "bold",
    marginTop: 8,
  },
  userTextContainer: {
    marginLeft: 16,
  },
  cancelButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  emptyDescription: {
    textAlign: "center",
    fontSize: 14,
    color: "#757575",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  findFriendsButton: {
    marginTop: 16,
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  findFriendsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
