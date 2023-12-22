import React  from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useContext,useLayoutEffect, useState } from 'react';
import {Ionicons} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native'
import {MaterialIcons} from '@expo/vector-icons';
import {UserType} from '../UserContext'


const HomeScreen = () => {

  const navigation = useNavigation();
  const {userId, setUserId} = useContext(UserType)
  const [users, seUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons name="people-outline" size={24} color="black" />
        </View>
      )
    })
  }, []);
  
  useFocusEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode("token");
      const UserId = decodedToken.userId;
      setUserId(uderId)
      axios.get(`http://localhost:8000/users/${userId}`).then((response) => {
        setUsers(response.data)
      }).catch((error) => {
        console.log("error retrieving users", error)
      });
    };
    fetchUsers();
  }, []);
  console.log('users', users);
  return (
    <View>
      <View style={{padding:10}}>
        {users.map((item, index) => (
            <User key={index} item={item} />
        ))}
      </View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})