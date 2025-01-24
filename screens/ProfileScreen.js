import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";

const ProfileScreen = ({ route }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(UserContext);
  const userId = user.userId;
  const navigation = useNavigation();

  const handleLogout = () => {
    if (logout()) {
      Alert.alert("You have successfully logged out!");
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`http://192.168.1.3:8000/friend-requests/${userId}`);
        setSentRequests(response.data.sentRequests);
        setReceivedRequests(response.data.receivedRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={user.image ? { uri: user.image } : require("../assets/profile.png")}
          style={styles.profileImage}
        />
      </View>

      {/* Total Requests Section */}
      <View style={styles.requestSummary}>
        <TouchableOpacity
          style={styles.summaryBox}
          onPress={() => navigation.navigate("Requesting")}
        >
          <Text style={styles.summaryCount}>{sentRequests.length}</Text>
          <Text style={styles.summaryText}>Requesting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.summaryBox}
          onPress={() => navigation.navigate("Requested")}
        >
          <Text style={styles.summaryCount}>{receivedRequests.length}</Text>
          <Text style={styles.summaryText}>Requested</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  header: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  requestSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  summaryBox: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
