import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';

export default function MyEventsScreen() {
  const { userId, role } = useAuth();
  const { getUserEvents, refreshEvents, loading } = useEvents();
  const [refreshing, setRefreshing] = useState(false);

  const myEvents = userId ? getUserEvents(userId) : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  if (loading && myEvents.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {myEvents.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>{role === 'user' ? '📅' : '📝'}</Text>
          <Text style={styles.emptyText}>No events yet</Text>
          <Text style={styles.emptySubtext}>
            {role === 'user'
              ? 'Join events from the Event List tab'
              : 'Create events to see them here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={myEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              role={role!}
              isJoined={item.attendees.includes(userId || '')}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
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
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingVertical: 8,
  },
});
