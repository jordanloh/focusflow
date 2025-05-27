import { createStackNavigator } from '@react-navigation/stack';
import type { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../lib/supabase';
import AccountPage from './AccountPage';
import Auth from './Auth';
import MainPage from './MainPage';

const Stack = createStackNavigator();

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
  
    checkAuth();
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainPage} />
          <Stack.Screen name="Account">
            {props => <AccountPage {...props} user={user} />}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Login">
          {props => (
            <Auth
              {...props}
              onSuccessfulLogin={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
              }}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}




