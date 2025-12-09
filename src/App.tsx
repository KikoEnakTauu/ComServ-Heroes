import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </EventProvider>
    </AuthProvider>
  );
}
