import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function HomeScreen() {
  const { userId, role } = useAuth();
  const { events, getUserEvents, loading } = useEvents();

  const myEvents = userId ? getUserEvents(userId) : [];
  const upcomingEvents = events.slice(0, 3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.greeting}>Welcome Back! 👋</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>You are logged in as:</Text>
            <Text style={styles.roleValue}>{role?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{myEvents.length}</Text>
            <Text style={styles.statLabel}>
              {role === 'sso' ? 'Created' : 'Joined'}
            </Text>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Quick Navigation</Text>
          <Text style={styles.infoText}>
            • Use the <Text style={styles.boldText}>Events</Text> tab to view all events
          </Text>
          <Text style={styles.infoText}>
            • Check <Text style={styles.boldText}>My Events</Text> for your {role === 'sso' ? 'created' : 'joined'} events
          </Text>
          <Text style={styles.infoText}>
            • Visit <Text style={styles.boldText}>Profile</Text> to view stats and logout
          </Text>
        </View>

        {/* Upcoming Events Preview */}
        {upcomingEvents.length > 0 && (
          <View style={styles.upcomingCard}>
            <Text style={styles.upcomingTitle}>Recent Events</Text>
            {upcomingEvents.map((event, index) => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetail}>📅 {event.date}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  roleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  roleLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  roleValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  upcomingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  eventItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDetail: {
    fontSize: 14,
    color: '#666',
  },
});
