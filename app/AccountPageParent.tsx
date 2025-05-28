// In some parent or layout
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AccountPage from './AccountPage'

export default function AccountPageParent() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
  })
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
  })
  return () => {
    listener?.subscription.unsubscribe()
  }
}, [])

    return <AccountPage session={session || null} />  
}
