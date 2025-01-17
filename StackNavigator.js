import { StyleSheet } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import FriendScreen from './screens/FriendScreen'
import ChatScreen from './screens/ChatScreen'
import ChatMessageScreen from './screens/ChatMessageScreen'

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown:false}}/>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown:false}}/>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown:true}}/>
        <Stack.Screen
          name="Friends"
          component={FriendScreen}
          options={{headerShown:true}}/>
        <Stack.Screen
          name="Chats"
          component={ChatScreen}
          options={{headerShown:true}}/>
        <Stack.Screen
          name="Messages"
          component={ChatMessageScreen}
          options={{headerShown:true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})