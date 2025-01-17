import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { userId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() => {
        const acceptedFriendsList = async () => {
            try {
                if (!userId) {
                    console.log('No userId found!');
                    return;
                }
                console.log(userId)
                const response = await fetch(`http://192.168.1.3:8000/accepted-friends/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setAcceptedFriends(data);
                }
            } catch (error) {
                console.log('Error showing accepted friends:', error);
            }
        };

        if (userId) {
            acceptedFriendsList();
        }
    }, [userId]);

    console.log('Accepted friends:', acceptedFriends);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {acceptedFriends.map((item, index) => (
                <Pressable key={index} onPress={() => navigation.navigate("Messages", { friendId: item.id })}>
                    <UserChat item={item} />
                </Pressable>
            ))}
        </ScrollView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({});