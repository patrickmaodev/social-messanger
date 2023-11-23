import React, { useState } from 'react';
import { Pressable, KeyboardAvoidingView, StyleSheet, Text, TextInput, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

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
      <Pressable style={{borderRadius:6,width:200, backgroundColor:"#4A55A2", padding:15, marginTop:15, marginLeft:"auto", marginRight:"auto"}}>
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
