import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  createdBy: string;
  attendees: string[];
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'attendees'>) => Promise<void>;
  joinEvent: (eventId: string, userId: string) => Promise<void>;
  getUserEvents: (userId: string) => Event[];
  loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const EVENTS_STORAGE_KEY = '@community_app_events';

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from AsyncStorage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEvents = async (newEvents: Event[]) => {
    try {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const addEvent = async (event: Omit<Event, 'id' | 'attendees'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      attendees: [],
    };
    const updatedEvents = [...events, newEvent];
    await saveEvents(updatedEvents);
  };

  const joinEvent = async (eventId: string, userId: string) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        // Check if user already joined
        if (!event.attendees.includes(userId)) {
          return {
            ...event,
            attendees: [...event.attendees, userId],
          };
        }
      }
      return event;
    });
    await saveEvents(updatedEvents);
  };

  const getUserEvents = (userId: string) => {
    return events.filter(
      (event) => event.attendees.includes(userId) || event.createdBy === userId
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        joinEvent,
        getUserEvents,
        loading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
