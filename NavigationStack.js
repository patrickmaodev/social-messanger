import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from './contexts/UserContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FriendScreen from './screens/FriendScreen';
import ChatMessageScreen from './screens/ChatMessageScreen';
import LoadingScreen from './components/LoadingScreen';
import UsersScreen from './screens/UsersScreen';
import TabNavigator from './components/TabNavigator';
import RequestingScreen from './screens/RequestingScreen';
import RequestedScreen from './screens/RequestedScreen';

const NavigationStack = () => {
  const Stack = createNativeStackNavigator();
  const { authToken, loading } = useContext(UserContext);
  console.log("the router auth token is ",authToken)
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {authToken ? (
          <>
            <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Friend" component={FriendScreen} />
            <Stack.Screen name="Messages" component={ChatMessageScreen} />
            <Stack.Screen name="Users" component={UsersScreen} />
            <Stack.Screen name="Requesting" component={RequestingScreen} />
            <Stack.Screen name="Requested" component={RequestedScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;
