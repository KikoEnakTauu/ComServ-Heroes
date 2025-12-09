-- =============================================
-- Supabase Database Setup for Community App
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://app.supabase.com/project/_/sql

-- 1. Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create event_attendees junction table (for many-to-many relationship)
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id) -- Prevent duplicate joins
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for events table

-- All authenticated users can view all events (needed for discovery and joining)
CREATE POLICY "All users can view all events"
  ON events FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- All authenticated users can create events (role check handled in app)
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- SSO users can update their own events
CREATE POLICY "SSO users can update their own events"
  ON events FOR UPDATE
  USING (created_by = auth.uid());

-- SSO users can delete their own events
CREATE POLICY "SSO users can delete their own events"
  ON events FOR DELETE
  USING (created_by = auth.uid());

-- 6. Create policies for event_attendees table

-- All authenticated users can view all event attendees (needed to show attendee counts)
CREATE POLICY "All users can view event attendees"
  ON event_attendees FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can join events
CREATE POLICY "Users can join events"
  ON event_attendees FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can leave events (delete their own joins)
CREATE POLICY "Users can leave events"
  ON event_attendees FOR DELETE
  USING (user_id = auth.uid());

-- 7. Create function to get event with attendee count
CREATE OR REPLACE FUNCTION get_events_with_attendees()
RETURNS TABLE (
  id UUID,
  title TEXT,
  date TEXT,
  location TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  attendee_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.date,
    e.location,
    e.created_by,
    e.created_at,
    COUNT(ea.user_id) as attendee_count
  FROM events e
  LEFT JOIN event_attendees ea ON e.id = ea.event_id
  GROUP BY e.id, e.title, e.date, e.location, e.created_by, e.created_at
  ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to check if user has joined an event
CREATE OR REPLACE FUNCTION has_user_joined_event(event_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM event_attendees
    WHERE event_id = event_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
