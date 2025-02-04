import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const ChatScreen = ({ route, navigation }) => {
    const { user, authToken } = useContext(UserContext);
    const [chatData, setChatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = user.userId;

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get(`http://192.168.1.3:8000/chats/${userId}`);
                const messages = response.data.messages;
    
                const lastMessagesMap = new Map();
    
                messages.forEach((msg) => {
                    const participants = [msg.senderId._id, msg.recipientId._id].sort().join('-');
    
                    if (!lastMessagesMap.has(participants) || new Date(msg.timestamp) > new Date(lastMessagesMap.get(participants).timestamp)) {
                        lastMessagesMap.set(participants, msg);
                    }
                });
    
                const formattedData = Object.values(
                    messages.reduce((acc, msg) => {
                        const otherUser = msg.senderId._id === userId ? msg.recipientId : msg.senderId;
                        acc[otherUser._id] = {
                            id: msg._id,
                            name: otherUser.name,
                            lastMessage: msg.message || "Image/Attachment",
                            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            recipientId: otherUser._id,
                        };
                        return acc;
                    }, {})
                );
                
    
                setChatData(formattedData);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchChats();
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A55A2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* Chat List */}
            <View style={styles.chatList}>
                <FlatList
                    data={chatData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Messages', { recipientId: item.recipientId })}
                            style={styles.chatItem}
                        >
                            <View style={styles.chatInfo}>
                                <Text style={styles.chatName}>{item.name}</Text>
                                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                            </View>
                            <Text style={styles.chatTime}>{item.time}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyList}>
                            <Text style={styles.emptyText}>No chats available yet.</Text>
                            <TouchableOpacity
                                style={styles.startChatButton}
                                onPress={() => navigation.navigate('Friends')}
                            >
                                <Text style={styles.startChatButtonText}>Start New Chat</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F6F6' },
    header: {
        backgroundColor: '#4A55A2',
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    chatList: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 15 },
    chatItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatInfo: { flex: 1 },
    chatName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    lastMessage: { fontSize: 14, color: '#666' },
    chatTime: { fontSize: 12, color: '#999' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyList: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    emptyText: { fontSize: 16, color: '#999', marginBottom: 10 },
    startChatButton: {
        backgroundColor: '#4A55A2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    startChatButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
