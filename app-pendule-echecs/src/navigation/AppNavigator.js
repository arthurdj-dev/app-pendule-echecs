import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen   from '../screens/HomeScreen';
import CustomScreen from '../screens/CustomScreen';
import GameScreen   from '../screens/GameScreen';
import EndScreen    from '../screens/EndScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home"   component={HomeScreen} />
        <Stack.Screen name="Custom" component={CustomScreen} />
        <Stack.Screen name="Game"   component={GameScreen} />
        <Stack.Screen name="End"    component={EndScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}