import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function AddEventScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const { role } = useAuth();
  const { addEvent } = useEvents();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title.trim() || !date.trim() || !location.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    const result = await addEvent({
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      createdBy: '', // Will be set automatically by Supabase
    });

    if (result.success) {
      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
      
      setTitle('');
      setDate('');
      setLocation('');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Event</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dec 15, 2025"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
