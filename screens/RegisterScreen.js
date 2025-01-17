import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Text, TextInput, Pressable, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import formStyles from '../styles/formStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = { name, email, password, image };
    axios
      .post('http://192.168.1.3:8000/register', user)
      .then((response) => {
        console.log(response);
        Alert.alert("Registered Successfully", "You have been registered Successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        Alert.alert("Registration Error", "An Error Occurred During Registration");
        console.log('Registration failed', error);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={formStyles.container}>
        <KeyboardAvoidingView>
          <View style={formStyles.header}>
            <Text style={formStyles.title}>Sign Up</Text>
            <Text style={formStyles.subtitle}>Create a New Account</Text>
          </View>
        </KeyboardAvoidingView>

        <View style={formStyles.inputContainer}>
          <Text style={formStyles.label}>Name</Text>
          <View style={formStyles.inputWrapper}>
            <Icon name="person-outline" size={20} color="#4A55A2" style={formStyles.icon} />
            <TextInput
              value={name}
              onChangeText={setName}
              style={formStyles.input}
              placeholderTextColor="gray"
              placeholder="Enter your name"
            />
          </View>
        </View>

        <View style={formStyles.inputContainer}>
          <Text style={formStyles.label}>Email</Text>
          <View style={formStyles.inputWrapper}>
            <Icon name="mail-outline" size={20} color="#4A55A2" style={formStyles.icon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={formStyles.input}
              placeholderTextColor="gray"
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
              placeholderTextColor="gray"
              placeholder="Enter your password"
            />
          </View>
        </View>

        <View style={formStyles.inputContainer}>
          <Text style={formStyles.label}>Image URL</Text>
          <View style={formStyles.inputWrapper}>
            <Icon name="image-outline" size={20} color="#4A55A2" style={formStyles.icon} />
            <TextInput
              value={image}
              onChangeText={setImage}
              style={formStyles.input}
              placeholderTextColor="gray"
              placeholder="Enter image URL"
            />
          </View>
        </View>

        <Pressable onPress={handleRegister} style={formStyles.button}>
          <Text style={formStyles.buttonText}>Register</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={formStyles.link}>
          <Text style={{ flexDirection: 'row' }}>
            Already have an Account?{' '}
            <Text style={[formStyles.linkText, { textDecorationLine: 'underline' }]}>
              Sign In
            </Text>
          </Text>
        </Pressable>
        
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
