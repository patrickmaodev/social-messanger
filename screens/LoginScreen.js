import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Pressable, KeyboardAvoidingView, StyleSheet, Text, TextInput, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  // useEffect(() => {
  //   const checkLoginStatus = async() => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");

  //       if(token){
  //         navigation.replace("Home")
  //       }
  //       else{
  //         console.log("User not logged in");
  //       }

  //     }catch(error){
  //       console.log("error",error)
  //     }
  //   };

  //   checkLoginStatus();
  // },[])

  const handleLogin = () => {
    const user = {
      email: email,
      password: password
    }
    axios.post("http://localhost:8000/login", user).then((response) => {
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token);
    navigation .replace("Home");
    }).catch((error) => {
      Alert.alert("Login Error", "Invalid email or password");
      console.log("Login Error", error);
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10, alignItems: "center" }}>
      <KeyboardAvoidingView>
        <View style={{ marginTop: 100 }}>
          <Text style={{
            color: "#4A55A2",
            fontSize: 17,
            fontWeight: 600,
            textAlign:"center"
          }}>Sign In</Text>
          <Text style={{
            marginTop: 15,
            fontSize: 17,
            fontWeight: 600,
            textAlign:"center"
          }}>Sign In To Account</Text>
        </View>
      </KeyboardAvoidingView>

      <View style={{ marginTop: 50 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: 'gray'
        }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            fontSize: email ? 18 : 16,
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
            width: 300
          }}
          placeholderTextColor={"black"}
          placeholder="Enter your email"
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: 'gray'
        }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextInputField={(true)}
          style={{
            fontSize: password ? 18 : 16,
            borderBottomColor: "gray",
            borderBottomWidth: 1,
            marginVertical: 10,
            width: 300
          }}
          placeholderTextColor={"black"}
          placeholder="Enter your password"
        />
      </View>
      <Pressable 
      onPress={handleLogin} style={{borderRadius:6,width:200, backgroundColor:"#4A55A2", padding:15, marginTop:15, marginLeft:"auto", marginRight:"auto"}}>
        <Text
        style={{textAlign:"center", fontSize:16, color:"white", fontWeight:"bold"}}>Login</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Register")} style={{marginTop:15}}>
        <Text style={{textAlign:"center", color:"gray", fontSize:16}}>
          Don't have an Account? Sign Up
        </Text>

      </Pressable>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  
});
