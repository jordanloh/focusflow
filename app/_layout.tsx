import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Auth" options={{ title: "Auth" , headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todolist" options={{ title: "To-do List" }} />
      <Stack.Screen name="AccountPage" options={{ title: "Account" }} />
    </Stack>
  );
}
