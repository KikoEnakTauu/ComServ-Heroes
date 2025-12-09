import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { role, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Community App</Text>
      
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Current Role:</Text>
        <Text style={styles.roleValue}>{role}</Text>
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
    marginBottom: 40,
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
