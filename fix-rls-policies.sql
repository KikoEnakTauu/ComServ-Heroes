-- Complete RLS Policy Fix - Run this in Supabase SQL Editor
-- This removes ALL problematic policies and recreates them correctly

-- 1. Drop ALL existing policies on both tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'events') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON events';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'event_attendees') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON event_attendees';
    END LOOP;
END $$;

-- 2. Create new simplified policies for EVENTS table

-- All authenticated users can view all events
CREATE POLICY "All users can view all events"
  ON events FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- All authenticated users can create events (role check handled in app)
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own events
CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (created_by = auth.uid());

-- 3. Create new simplified policies for EVENT_ATTENDEES table

-- All users can view all event attendees
CREATE POLICY "All users can view event attendees"
  ON event_attendees FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can join events (insert their own attendance)
CREATE POLICY "Users can join events"
  ON event_attendees FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can leave events (delete their own attendance)
CREATE POLICY "Users can leave events"
  ON event_attendees FOR DELETE
  USING (user_id = auth.uid());

-- 4. Verify all policies are created correctly
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING: ' || qual
        ELSE 'No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
        ELSE 'No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies
WHERE tablename IN ('events', 'event_attendees')
ORDER BY tablename, policyname;
