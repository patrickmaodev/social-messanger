import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { Image } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../constants/config';

const ChatMessageScreen = () => {
    const {user} = useContext(UserContext);
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const route = useRoute();
    const [selectedMessages, setSelectedMessages] = useState("");
    const [messages, setMessages] = useState([]);
    const [recipientData, setRecipientData] = useState("");
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const { recipientId } = route.params;
    const [message, setMessage] = useState("");
    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };

    const fetchMessages = async () => {
        if (!user || !recipientId) return;

        const senderId = user.userId;

        try {
            const response = await fetch(`${API_BASE_URL}/messages/${senderId}/${recipientId}/`);
            const data = await response.json();
            if (response.ok) {
                setMessages(data);
            } else {
                console.log("Error fetching messages:", response.statusText);
            }
        } catch (error) {
            console.log("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (user && recipientId) {
            fetchMessages();
        }
    }, [user, recipientId]);

    // Fetching recipient details
    useEffect(() => {
        const fetchRecipientData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/user/${recipientId}/`);
            const data = await response.json();
            setRecipientData(data);
        } catch (error) {
            console.log("Error retrieving recipient details:", error);
        }
        }
        fetchRecipientData();
    }, [recipientId]);

    // Send message function
    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData();
            formData.append("senderId", user.userId);
            formData.append("recipientId", recipientId);

            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await fetch(`${API_BASE_URL}/messages/`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("");
                setSelectedImage(null);
                fetchMessages();
            } else {
                console.log("Error sending message:", response.statusText);
            }
        } catch (error) {
            console.log("Error in sending the message:", error);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => {
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />
                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>{selectedMessages.length}</Text>
                        </View>
                    ) : (
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                resizeMode: "cover",

                            }} />
                        <Text style={{
                            marginLeft: 5, fontSize: "bold",
                            fontWeight: 4
                        }}></Text>
                    </View>
                    )}
                    
                </View>
            },
            headerRight: () => selectedMessages > 0 ? (
                <View>
                    <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
                    <Ionicons name="md-arrow-redo" size={24} color="black" />
                    <FontAwesome name="star" size={24} color="black" />
                    <MaterialIcons name="delete" size={24} color="black" />
                </View>
            ): null
        });
    }, [recipientData]);

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            handleSend("image", result.uri);
        }
    };

    const handleSelectMessage = (message) => {
        const isSelected = selectedMessages.includes(message._id);

        if(isSelected){
            setSelectedMessages((previousMessages) => previousMessages.filter((id) => id !== message._id)
            );
        }else{
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0"}}>
            <ScrollView>
                {messages.map((item, index) => {
                    const isSender = item?.sender?.id === user.userId;

                    return (
                        <Pressable
                            onLongPress={() => handleSelectMessage(item)}
                            key={index}
                            style={[
                                isSender
                                    ? {
                                        alignSelf: "flex-end",
                                        backgroundColor: "#DCF8C6",
                                        padding: 8,
                                        maxWidth: "60%",
                                        borderRadius: 7,
                                        margin: 10
                                    }
                                    : {
                                        alignSelf: "flex-start",
                                        backgroundColor: "white",
                                        padding: 8,
                                        margin: 10,
                                        borderRadius: 7,
                                        maxWidth: "60%"
                                    },
                            ]}>
                            <Text style={{ fontSize: 13, textAlign: isSender ? "right" : "left" }}>
                                {item?.content}
                            </Text>
                            <Text
                                style={{
                                    textAlign: "right",
                                    fontSize: 9,
                                    color: "gray",
                                    marginTop: 5,
                                }}>
                                {formatTime(item.timestamp)}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
            <View style={{
                flexDirection: "row",
                alignItems: "center", paddingHorizontal: 10,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: "#dddddd",
                marginBottom: 25
            }}>
                <Entypo
                    onPress={handleEmojiPress}
                    name="emoji-happy"
                    size={24}
                    color="black" />
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10
                    }}
                    placeholder="Type your message..."
                />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>
                    <Entypo
                        onPress={pickImage} name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
                </Pressable>
            </View>
            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }} />
            )}
        </KeyboardAvoidingView>
    )
}

export default ChatMessageScreen

const styles = StyleSheet.create({})