import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Auth" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainPage" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AccountPage" 
          options={{ title: 'Your Account', headerBackTitle: "Back" }}
        />
        <Stack.Screen 
          name="todolist" 
          options={{ title: "To-do List", headerBackTitle: "Back" }}
        />
        <Stack.Screen 
          name="AccountPageParent" 
          options={{ title: 'Your Account', headerBackTitle: "Back" }}
        />
      </Stack>
    </AuthProvider>
  );
}
