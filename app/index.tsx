import { Redirect } from 'expo-router';
import { useAuth } from './AuthContext';

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null; 
  }

  if (!session) {
    return <Redirect href="/Auth" />;
  }

  return <Redirect href="/MainPage" />;
}