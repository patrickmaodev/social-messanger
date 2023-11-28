import React, { useState } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, KeyboardAvoidingView, Text, View, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
  const user = {
      name:name,
      email:email,
      password:password,
      image:image,
    }
 // send a POST request API to register user
 axios.post('http://localhost:8000/register',user).then((response)=>{
  console.log(response);
  Alert.alert("Registered Successfully" ,
  "You have been registered Successfully!");
  setName ("");
  setEmail ("");
  setPassword ("");
  setImage("");
 }).catch((error)=>{
  Alert.alert("Registration Error","An Error Occured During Registration");
  console.log('registration failed',error);
 })
}
  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
      <Text>Register Page</Text>
      <KeyboardAvoidingView behavior="padding">
        <View style={{ marginTop: 100 }}>
          <Text
            style={{
              color: '#4A55A2',
              fontSize: 17,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Sign In
          </Text>
          <Text
            style={{
              marginTop: 15,
              fontSize: 17,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Sign In To Account
          </Text>
        </View>
      </KeyboardAvoidingView>

      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          style={{
            fontSize: name ? 18 : 16,
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            marginVertical: 10,
            width: 300,
          }}
          placeholderTextColor={'black'}
          placeholder="Enter your name"
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            fontSize: email ? 18 : 16,
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            marginVertical: 10,
            width: 300,
          }}
          placeholderTextColor={'black'}
          placeholder="Enter your email"
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          style={{
            fontSize: password ? 18 : 16,
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            marginVertical: 10,
            width: 300,
          }}
          placeholderTextColor={'black'}
          placeholder="Enter your password"
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Image</Text>
        <TextInput
          value={image}
          onChangeText={(text) => setImage(text)}
          style={{
            fontSize: password ? 18 : 16,
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            marginVertical: 10,
            width: 300,
          }}
          placeholderTextColor={'black'}
          placeholder="Image"
        />
      </View>

      <Pressable
      onPress={handleRegister}
        style={{
          borderRadius: 6,
          width: 200,
          backgroundColor: '#4A55A2',
          padding: 15,
          marginTop: 15,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold' }}>Register</Text>
      </Pressable>
      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
        <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
          Already have an Account? Sign In
        </Text>
      </Pressable>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
