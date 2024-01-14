import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { Image } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";

const ChatMessageScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const route = useRoute();
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
        try {
            const response = await fetch(`http://localhost:8000/${userId}/${recipientId}`);
            const data = await response.jmson();
            if (response.ok) {
                setMessages(data)
            } else {
                console.log("error showing messages", response.status.message);
            }
        } catch (error) {
            console.log("error fetching messages", error);
        }
    }
    useEffect(() => {
        fetchMessages();

    }, [])
    useEffect(() => {
        const fetchRecipientData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/${recipientId}`);
                const data = response.json();
                setRecipientData(data);
            } catch (error) {
                console.log("error retrieving details");
            }
        }
        fetchRecipientData();
    }, [])
    const handleSend = async (messageType, imageUrl) => {
        try {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recipientId", id);

            //if message type id image or a normal text
            if (messageType === "image") {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg"
                });
            } else {
                formData.append("messageType", "text");
                formData.append("messageText", messsage);
            }
            const response = await fetch("http://localhost:8000/messages", {
                method: "POST",
                body: formData
            })
            if (response.ok) {
                setMessage("");
                setSelectedImage("");

                fetchMessages();
            }
        } catch (error) {
            console.log("error in sending the message", error);
        }
    };
    console.log("messages", messages);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => {
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>
                    <Ionicons onpress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />
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
                </View>
            }
        });
    }, [recipientData]);
    const formatTime = (time) => {
        const options = { hour: "numeric", minutes: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
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
    }
    return (
        <KeyboardAvoidingView>
            <ScrollView>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.denderId?._id === userId
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
                                <Text style={{ fontSize: 13, textAlign: "left" }}>{item?.message}</Text>
                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: "gray",
                                        marginTop: 5,
                                    }}>{formatTime(item.time)}</Text>
                            </Pressable>
                        )
                    }
                    if (item.messageType === "image") {
                        const baseUrl = "/Users/getcore/React-Native-Apps/social-messanger/api/files/";
                        const imageURl = item.imageUrl;
                        const filename = imageURl.split("/").pop();
                        const source = { uri: baseUrl + filename };
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.denderId?._id === userId
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
                                <View>
                                    <Image
                                        source={source}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            borderRadius: 7
                                        }} />
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 9,
                                            color: "gray",
                                            position: "absolute",
                                            right: 10,
                                            bottom: 7,
                                            color: "gray",
                                            marginTop: 5
                                        }}>{formatTime(item?.timeStamp)}</Text>
                                </View>

                            </Pressable>
                        )
                    }
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