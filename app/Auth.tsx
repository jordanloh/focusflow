import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Auth({
  navigation,
  onSuccessfulLogin,
}: {
  navigation: any;
  onSuccessfulLogin: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
      return;
    }

    onSuccessfulLogin();
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
      return;
    }

    if (!data.session) {
      Alert.alert('Success', 'Check your email to confirm sign up!');
    } else {
      onSuccessfulLogin(); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FocusFlow!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonOutline, loading && styles.buttonDisabledOutline]}
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text style={[styles.buttonTextOutline, loading && styles.textDisabled]}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#003049',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#003049',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderColor: '#003049',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextOutline: {
    color: '#003049',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonDisabledOutline: {
    borderColor: '#999',
  },
  textDisabled: {
    color: '#999',
  },
});
