import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EventListScreen from '../screens/EventListScreen';
import AddEventScreen from '../screens/AddEventScreen';
import MyEventsScreen from '../screens/MyEventsScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  EventList: undefined;
  AddEvent: undefined;
  MyEvents: undefined;
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
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Home' }}
            />
            <Stack.Screen 
              name="EventList" 
              component={EventListScreen}
              options={{ title: 'All Events' }}
            />
            <Stack.Screen 
              name="AddEvent" 
              component={AddEventScreen}
              options={{ title: 'Create Event' }}
            />
            <Stack.Screen 
              name="MyEvents" 
              component={MyEventsScreen}
              options={{ title: 'My Events' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
