import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import EventListScreen from '../screens/EventListScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
  HomeTab: undefined;
  EventsTab: undefined;
  MyEventsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="EventsTab"
        component={EventListScreen}
        options={{
          title: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>{color === '#007AFF' ? '📋' : '📄'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyEventsTab"
        component={MyEventsScreen}
        options={{
          title: 'My Events',
          tabBarLabel: 'My Events',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>{color === '#007AFF' ? '✓' : '○'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
