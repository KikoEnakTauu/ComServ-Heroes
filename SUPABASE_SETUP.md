# Supabase Setup Instructions

This app uses Supabase for authentication and database storage. Follow these steps to set up your Supabase project:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or login
3. Click "New Project"
4. Fill in your project details:
   - Project name: `community-app` (or any name you prefer)
   - Database password: (choose a strong password)
   - Region: (select closest to your location)
5. Click "Create new project"
6. Wait for the project to finish setting up (takes about 2 minutes)

## 2. Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click **Run** to execute the SQL
6. This will create:
   - `events` table for storing events
   - `event_attendees` table for tracking who joined which event
   - Row Level Security (RLS) policies for data access control
   - Proper indexes for performance

## 3. Get Your API Keys

1. Go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

## 4. Configure the App

1. Open `src/utils/supabase.ts`
2. Replace the placeholder values with your actual credentials:

```typescript
const SUPABASE_URL = 'https://szdqzhvrsdnscmxwwopi.supabase.co'; // Your Project URL
const SUPABASE_ANON_KEY = 'szdqzhvrsdnscmxwwopi'; // Your anon/public key
```

## 5. Configure Email Settings (Optional)

By default, Supabase requires email confirmation for new sign ups.

### To disable email confirmation (for development):
1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Scroll down to "Email"
3. **Disable** "Confirm email"

### To keep email confirmation (recommended for production):
1. Keep the default settings
2. Users will receive a confirmation email after signing up
3. They must click the link in the email before they can login

## 6. Understanding the Database Structure

### Tables:
- **events**: Stores all events created by SSO users
  - `id`: Unique event identifier
  - `title`: Event name
  - `date`: Event date
  - `location`: Event location
  - `created_by`: UUID of the SSO user who created it
  - `created_at`: Timestamp

- **event_attendees**: Tracks which users joined which events
  - `event_id`: Reference to events table
  - `user_id`: Reference to auth.users table
  - `joined_at`: Timestamp

### Row Level Security (RLS) Policies:
- **SSO Users** (emails ending with @sso.com, @admin.com, @organizer.com):
  - Can view ALL events
  - Can create new events
  - Can update/delete their own events
  
- **Regular Users** (all other email domains):
  - Can only view events they've joined
  - Can join and leave events
  - Cannot create events

## 7. Test the Authentication

### Sign Up Test:
- Email: `test@gmail.com` (will be assigned User role)
- Password: `password123` (min 6 characters)

### SSO Role Test:
- Email: `admin@sso.com` (will be assigned SSO role)
- Password: `password123`

### Email Domain Rules:
- **SSO Role**: `@sso.com`, `@admin.com`, `@organizer.com`
- **User Role**: Any other email domain (e.g., `@gmail.com`, `@yahoo.com`)

## 6. Security Notes

⚠️ **Important**: Never commit your Supabase keys to public repositories!

For production:
1. Use environment variables
2. Enable Row Level Security (RLS) in Supabase
3. Configure proper email templates
4. Set up custom SMTP for email delivery

## 7. Troubleshooting

### "Invalid login credentials"
- Make sure you've signed up first
- Check if email confirmation is enabled and verify your email
- Verify password is at least 6 characters

### "Failed to fetch"
- Check your internet connection
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Make sure there are no typos in the credentials

### Session not persisting
- AsyncStorage should handle this automatically
- Try clearing app data and logging in again
- Check if AsyncStorage permissions are granted

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
