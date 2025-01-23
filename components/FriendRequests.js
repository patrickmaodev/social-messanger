import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useContext } from 'react'
// import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';

const FriendRequests = (item, friendRequests, setFriendRequests) => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const acceptRequest = async (friendRequestId) => {
        try {
             const response = await fetch("http://192.168.1.3:8000/friend-request/accept",{
                method: "POST",
                headers: {
                    "ContentType": "application/json"
                },
                body:JSON.stringify({
                    senderId: friendRequestId,
                    recipientId: userId
                })
             })
             if(response.ok){
                setFriendRequests(friendRequests.filter((request) => request._id !== friendRequestId));
                navigation.navigate("Chats");
             }
        }catch(err){
            console.log("error accept friend request", err)
        }
    }
    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10
            }}>
            <Image
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{ uri: item.image }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}>{item?.name} sent you a friend request</Text>
            <Pressable
            onPress={() => acceptRequest(item._id)}
             style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}>
                <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequests
const styles = StyleSheet.create()