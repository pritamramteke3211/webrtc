import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Home from '../screens/Home';
import { createStackNavigator } from '@react-navigation/stack';
import Call from '../screens/Call';

const Navigation = () => {
    const Stack = createStackNavigator();
  return (
        <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Call" component={Call} />
        </Stack.Navigator>
        </NavigationContainer>
  )
}

export default Navigation