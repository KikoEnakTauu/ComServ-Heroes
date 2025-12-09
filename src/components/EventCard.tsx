import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '../context/EventContext';
import { UserRole, permissions } from '../utils/roles';

interface EventCardProps {
  event: Event;
  role: UserRole;
  onJoin?: (eventId: string) => void;
  isJoined?: boolean;
}

export default function EventCard({ event, role, onJoin, isJoined }: EventCardProps) {
  const canJoin = permissions[role].canJoin;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>📅 Date:</Text>
        <Text style={styles.value}>{event.date}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>📍 Location:</Text>
        <Text style={styles.value}>{event.location}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>👥 Attendees:</Text>
        <Text style={styles.value}>{event.attendees.length}</Text>
      </View>

      {canJoin && onJoin && (
        <TouchableOpacity
          style={[styles.button, isJoined && styles.buttonDisabled]}
          onPress={() => !isJoined && onJoin(event.id)}
          disabled={isJoined}
        >
          <Text style={styles.buttonText}>
            {isJoined ? 'Joined ✓' : 'Join Event'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A8A8A8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
