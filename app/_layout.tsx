import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="LoginPage" options={{ title: "Login" , headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todolist" options={{ title: "To-do List" }} />
      <Stack.Screen name="AccountPage" options={{ title: "Account" }} />
    </Stack>
  );
}
