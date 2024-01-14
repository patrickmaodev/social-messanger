import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

const ChatScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { useId, seetUserId } = useContext(UseType);
    const navigation = useNavigation();
    useEffect(() => {
        const acceptedFriendsList = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accepted-friends/${userId}`
                );
                const data = await response.json();
                if (response.ok) {
                    setAcceptedFriends(data);
                }

            } catch (error) {
                console.log('error showing accepted friends', error)
            }
        };

        acceptedFriendsList();
    }, []);
    console.log('friends', acceptedFriends)
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((index,item) => (
                    <USerChat key={index} item={item}/>
                ))}
            </Pressable>
        </ScrollView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({})