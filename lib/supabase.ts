import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://nadiyvsvttstysnknclg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZGl5dnN2dHRzdHlzbmtuY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDczMzksImV4cCI6MjA2MzkyMzMzOX0.ioGzNUbv-a536Vc0kXq4MGJI3SqIanv3FEeA9d_IUSI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
