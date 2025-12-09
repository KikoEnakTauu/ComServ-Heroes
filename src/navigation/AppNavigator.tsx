import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import AddEventScreen from '../screens/AddEventScreen';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  AddEvent: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="AddEvent" 
              component={AddEventScreen}
              options={{ title: 'Create Event' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
