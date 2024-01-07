import React, {useContext, UserType} from 'react'
import { View, StyleSheet, Text } from 'react-native'
import axios from 'axios';
import FriendRequests from '../components/FriendRequests';

const FriendScreen = () => {
    const { userID, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([])
    useEffect(() => {
        fetchFriendRequests()
    },[])
    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/friend-request/${userId}`);
            if (response.status === 2000){
                const friendRequestsData = response.data.map((fetchFriendRequest)=> ({
                    _id:friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.emage
                }))
                setFriendRequests(friendRequestsData)
            }
        }catch(error){
            console.error("error message", error)
        }
    }
    console.log(friendRequests)
  return (
    <View style={{padding: 10, marginHorizontal:12}}>
        {friendRequests.length>0 && <Text>Your friend requests</Text>}
        {friendRequests.map((item, index)=>(
            <FriendRequests 
            key={index} 
            item={item} 
            friendRequests={friendRequests} 
            setFriendRequests={sendFriendRequests}/>
        ))}
    </View>
  )
}

export default FriendScreen