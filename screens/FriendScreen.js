import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';
import FriendRequests from '../components/FriendRequests';

const FriendScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    console.log("the user is is",userId);
    
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchFriendRequests();
        }
    }, [userId]);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://192.168.1.3:8000/friend-request/${userId}`);
            if (response.status === 200) {
                console.log("Response data:", response.data);
                const friendRequestsData = response.data.friendRequests.map((fetchFriendRequest) => ({
                    _id: fetchFriendRequest._id,
                    name: fetchFriendRequest.name,
                    email: fetchFriendRequest.email,
                    image: fetchFriendRequest.image,
                }));
                
                setFriendRequests(friendRequestsData);
            } else {
                console.error(`Received unexpected status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching friend requests", error);
            if (error.response) {
                console.error("Response error status:", error.response.status);
                console.error("Response error data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error details:", error.message);
            }
        }
    };

    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 && <Text>Your friend requests</Text>}
            {friendRequests.map((item, index) => (
                <FriendRequests 
                    key={index} 
                    item={item} 
                    friendRequests={friendRequests} 
                    setFriendRequests={setFriendRequests}
                />
            ))}
        </View>
    );
};

export default FriendScreen;
