import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';

export default function LoginScreen() {
  const { login } = useAuth();

  const handleLoginAsUser = () => {
    login(ROLES.USER);
  };

  const handleLoginAsSSO = () => {
    login(ROLES.SSO);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community App</Text>
      <Text style={styles.subtitle}>Select your role to continue</Text>

      <TouchableOpacity 
        style={[styles.button, styles.userButton]}
        onPress={handleLoginAsUser}
      >
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.ssoButton]}
        onPress={handleLoginAsSSO}
      >
        <Text style={styles.buttonText}>Login as SSO</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    maxWidth: 300,
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
  userButton: {
    backgroundColor: '#007AFF',
  },
  ssoButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
