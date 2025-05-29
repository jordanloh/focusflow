import Ionicon from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function ProfilePic({ userId }: { userId: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return; 
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .single()

        if (error) {
          console.log('Error loading avatar:', error.message)
          setAvatarUrl(null)
          return
        }

        if (data?.avatar_url) {
          const { data: imageData, error: downloadError } = await supabase.storage
            .from('avatars') 
            .download(data.avatar_url)

          if (downloadError) {
            console.log('Error downloading avatar image:', downloadError.message)
            setAvatarUrl(null)
            return
          }

          const reader = new FileReader()
          reader.readAsDataURL(imageData)
          reader.onload = () => {
            setAvatarUrl(reader.result as string)
          }
          reader.onerror = (error) => {
            console.log('Error reading image blob:', error)
            setAvatarUrl(null)
          }
        } else {
          setAvatarUrl(null)
        }
      } catch (error) {
        console.log('Unexpected error:', error)
        setAvatarUrl(null)
      }
    }

    fetchProfile()
  }, [userId])

  return (
    avatarUrl ? ( 
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    ) : (
      <Ionicon name="person-circle-outline" size={40} color="#003049" />
    )
  )
}

