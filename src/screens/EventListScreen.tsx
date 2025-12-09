import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { permissions } from '../utils/roles';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EventListScreen() {
  const { userId, role } = useAuth();
  const { events, joinEvent, loading, refreshEvents } = useEvents();
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  const canAddEvent = role && permissions[role].canAddEvent;

  const handleJoinEvent = async (eventId: string) => {
    const result = await joinEvent(eventId);
    Alert.alert(
      result.success ? 'Success' : 'Error',
      result.message,
      [{ text: 'OK' }]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  const handleAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {canAddEvent && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      )}

      {events.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No events yet</Text>
          {canAddEvent ? (
            <Text style={styles.emptySubtext}>Tap the button above to create your first event!</Text>
          ) : (
            <Text style={styles.emptySubtext}>Check back later for new events</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              role={role!}
              onJoin={handleJoinEvent}
              isJoined={item.attendees.includes(userId || '')}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
