import React, { useContext } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'

const User = ({item}) => {
    const { userID, setUserId } = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    const sendFriendRequest = async(currentUserId, selectedUserId) => {
        try{
            const response = await fetch("http://192.168.1.3:8000/friend-request", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({currentUserId, selectedUserId})
            })
            if(reaponse.ok){
                setRequestSent(true);
            }
        }catch(error){
                console.log("error message", error)
            }
        };

    return (
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10}}>
            <View>
                <Image
                Style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    resizeMode: "cover",
                }}
                source={{ uri: item.image }} />

                
            </View>
            <View style={{marginLeft: 12, flex:1}}>
                <Text style={{marginWeight: "bold"}}>{item?.name}</Text>
                <Text style={{marginTop: 4}}>{item?.email}</Text>
            </View>
            <Pressable
            onPress = {() => sendFriendRequest(userID, item._id)}
                style={{
                    backgroundColor: "#567189",
                    padding:10,
                    borderRadius: 6,
                    width: 105 }}>
                <Text style={{textAlign: "center", color: "white", fontSize: 13}}>Add Friend</Text>

            </Pressable>
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({})