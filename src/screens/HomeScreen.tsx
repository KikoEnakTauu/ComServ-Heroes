import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { role, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Community App</Text>
      
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Current Role:</Text>
        <Text style={styles.roleValue}>{role}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('EventList')}
        >
          <Text style={styles.navButtonText}>📋 All Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('MyEvents')}
        >
          <Text style={styles.navButtonText}>
            {role === 'user' ? '✓ My Joined Events' : '📝 My Created Events'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  roleContainer: {
    backgroundColor: '#f5f5f5',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    minWidth: 250,
  },
  roleLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  roleValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
