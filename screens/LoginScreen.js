import React, { useState, useEffect } from 'react';
import { Alert, Pressable, KeyboardAvoidingView, Text, TextInput, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formStyles from '../styles/formStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Home");
        } else {
          console.log("User not logged in");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = { email, password };
    axios
      .post("http://192.168.1.3:8000/login", user)
      .then((response) => {
        const token = response.data.token;
        console.log("token from response is", token);
        AsyncStorage.setItem("authToken", token);
        navigation.replace("Home");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log("Login Error", error);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={formStyles.container}>
        <KeyboardAvoidingView>
          <View style={formStyles.header}>
            <Text style={formStyles.title}>Sign In</Text>
            <Text style={formStyles.subtitle}>Sign In To Account</Text>
          </View>
        </KeyboardAvoidingView>

        <View style={formStyles.inputContainer}>
          <Text style={formStyles.label}>Email</Text>
          <View style={formStyles.inputWrapper}>
            <Icon name="mail-outline" size={20} color="#4A55A2" style={formStyles.icon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={formStyles.input}
              placeholderTextColor={"gray"}
              placeholder="Enter your email"
            />
          </View>
        </View>

        <View style={formStyles.inputContainer}>
          <Text style={formStyles.label}>Password</Text>
          <View style={formStyles.inputWrapper}>
            <Icon name="lock-closed-outline" size={20} color="#4A55A2" style={formStyles.icon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={formStyles.input}
              placeholderTextColor={"gray"}
              placeholder="Enter your password"
            />
          </View>
        </View>

        <Pressable onPress={handleLogin} style={formStyles.button}>
          <Text style={formStyles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={formStyles.link}>
          <Text style={{ flexDirection: 'row' }}>
            Don't have an Account?{' '}
            <Text style={[formStyles.linkText, { textDecorationLine: 'underline' }]}>
              Sign Up
            </Text>
          </Text>
        </Pressable>
        
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
