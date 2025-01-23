import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

const ProfileScreen = ({ route }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(UserContext);
  const userId = user.userId;

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Total Requests Section */}
      <View style={styles.requestSummary}>
        <TouchableOpacity style={styles.summaryBox}>
          <Text style={styles.summaryCount}>{sentRequests.length}</Text>
          <Text style={styles.summaryText}>Requesting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.summaryBox}>
          <Text style={styles.summaryCount}>{receivedRequests.length}</Text>
          <Text style={styles.summaryText}>Requested</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  requestSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: "center",
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  requestName: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
