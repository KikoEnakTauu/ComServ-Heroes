import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  createdBy: string;
  attendees: string[];
  attendeeCount?: number;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'attendees'>) => Promise<{ success: boolean; message: string }>;
  joinEvent: (eventId: string) => Promise<{ success: boolean; message: string }>;
  leaveEvent: (eventId: string) => Promise<{ success: boolean; message: string }>;
  getUserEvents: (userId: string) => Event[];
  loading: boolean;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from Supabase on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setEvents([]);
        return;
      }

      // Fetch events with attendee information
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) {
        console.error('Error loading events:', eventsError);
        return;
      }

      // Fetch event attendees
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('event_attendees')
        .select('event_id, user_id');

      if (attendeesError) {
        console.error('Error loading attendees:', attendeesError);
      }

      // Map events with attendee information
      const eventsWithAttendees: Event[] = (eventsData || []).map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        createdBy: event.created_by,
        attendees: (attendeesData || [])
          .filter(a => a.event_id === event.id)
          .map(a => a.user_id),
        attendeeCount: (attendeesData || []).filter(a => a.event_id === event.id).length,
      }));

      setEvents(eventsWithAttendees);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, 'id' | 'attendees'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'You must be logged in to create events.' };
      }

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: event.title,
            date: event.date,
            location: event.location,
            created_by: user.id,
          }
        ])
        .select();

      if (error) {
        console.error('Error creating event:', error);
        return { success: false, message: error.message || 'Failed to create event.' };
      }

      await loadEvents();
      return { success: true, message: 'Event created successfully!' };
    } catch (error: any) {
      console.error('Error adding event:', error);
      return { success: false, message: error.message || 'An error occurred while creating the event.' };
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'You must be logged in to join events.' };
      }

      // Check if already joined
      const { data: existingJoin } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingJoin) {
        return { success: false, message: 'You have already joined this event.' };
      }

      const { error } = await supabase
        .from('event_attendees')
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
          }
        ]);

      if (error) {
        console.error('Error joining event:', error);
        return { success: false, message: error.message || 'Failed to join event.' };
      }

      await loadEvents();
      return { success: true, message: 'Successfully joined the event!' };
    } catch (error: any) {
      console.error('Error joining event:', error);
      return { success: false, message: error.message || 'An error occurred while joining the event.' };
    }
  };

  const leaveEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'You must be logged in.' };
      }

      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error leaving event:', error);
        return { success: false, message: error.message || 'Failed to leave event.' };
      }

      await loadEvents();
      return { success: true, message: 'Successfully left the event!' };
    } catch (error: any) {
      console.error('Error leaving event:', error);
      return { success: false, message: error.message || 'An error occurred while leaving the event.' };
    }
  };

  const refreshEvents = async () => {
    await loadEvents();
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
        leaveEvent,
        getUserEvents,
        loading,
        refreshEvents,
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
