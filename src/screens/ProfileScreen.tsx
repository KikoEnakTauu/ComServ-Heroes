import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function ProfileScreen() {
  const { role, email, logout } = useAuth();
  const { events, getUserEvents } = useEvents();
  const [loggingOut, setLoggingOut] = useState(false);

  const myEvents = role ? getUserEvents(role) : [];
  const totalEvents = events.length;

  const stats = {
    totalEvents,
    myEventsCount: myEvents.length,
    role: role || 'guest',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {role === 'sso' ? '👨‍💼' : '👤'}
            </Text>
          </View>
          <Text style={styles.roleTitle}>
            {role === 'sso' ? 'SSO Account' : 'User Account'}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{role?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalEvents}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.myEventsCount}</Text>
              <Text style={styles.statLabel}>
                {role === 'sso' ? 'Created' : 'Joined'}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email || 'Not available'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{role}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Permissions:</Text>
            <View style={styles.permissionsList}>
              {role === 'sso' ? (
                <>
                  <Text style={styles.permissionItem}>✓ Create Events</Text>
                  <Text style={styles.permissionItem}>✓ Manage Events</Text>
                </>
              ) : (
                <>
                  <Text style={styles.permissionItem}>✓ Join Events</Text>
                  <Text style={styles.permissionItem}>✓ View Events</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]} 
          onPress={async () => {
            setLoggingOut(true);
            await logout();
            setLoggingOut(false);
          }}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.versionText}>Community App v1.0.0</Text>
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
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 40,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
  },
  permissionsList: {
    marginTop: 4,
  },
  permissionItem: {
    fontSize: 14,
    color: '#34C759',
    marginVertical: 2,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonDisabled: {
    backgroundColor: '#999',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
});
