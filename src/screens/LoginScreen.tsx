import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = isSignUp 
      ? await signUp(email.trim(), password)
      : await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert(isSignUp ? 'Sign Up Failed' : 'Login Failed', result.message);
    } else if (isSignUp) {
      Alert.alert('Success', result.message);
      setIsSignUp(false);
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Community App</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Info</Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>SSO Role:</Text> Use email ending with @sso.com, @admin.com, or @organizer.com
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>User Role:</Text> Use any other email domain (e.g., @gmail.com)
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Password:</Text> Minimum 6 characters
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    marginTop: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '600',
    color: '#333',
  },
});
