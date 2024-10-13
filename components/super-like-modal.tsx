import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { doc, updateDoc, increment, setDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import xai from '@/lib/xai'
import { X } from 'lucide-react'

interface SuperLikeModalProps {
  profile: {
    name: string
    username: string
    image: string
    id: string
  }
  onClose: () => void
  onSend: (message: string) => void
}

export function SuperLikeModal({ profile, onClose, onSend }: SuperLikeModalProps) {
  const [message, setMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { data: session } = useSession()

  const generateMessage = async () => {
    setIsGenerating(true)
    setMessage('')

    try {
      console.log('Fetching user context for:', profile.username)
      const userContext = await fetchUserContext(profile.username)
      console.log('User context:', userContext)

      console.log('Initiating Grok API call')
      const stream = await xai.chat.completions.create({
        model: 'grok-2-mini-public',
        messages: [
          { role: 'system', content: 'You are Grok, an AI wingman assistant. Your task is to generate a persuasive and engaging message for a dating app super like. The message should be from the perspective of an mutual wingman trying to convince the recipient to give the sender a chance. Use the provided user contexts to personalize the message.' },
          { role: 'user', content: `Generate a super like message for ${profile.name}. Here's some context about them: ${JSON.stringify(userContext)}` }
        ],
        stream: true,
      })

      console.log('Grok API call initiated, streaming response')
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        console.log('Received chunk:', content)
        setMessage(prev => prev + content)
      }
      console.log('Grok message generation completed')
    } catch (error) {
      console.error('Error generating message:', error)
      setMessage('Sorry, there was an error generating the message. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSend = async () => {
    if (message && session?.user?.id) {
      console.log('Sending Super Like')
      try {
        // Send the super like
        await setDoc(doc(db, "superLikes", `${session.user.id}_${profile.id}`), {
          senderId: session.user.id,
          recipientId: profile.id,
          message,
          sentAt: new Date().toISOString()
        })

        // Update super likes count
        const siteStatsRef = doc(db, "siteStats", "credits");
        await updateDoc(siteStatsRef, {
          superLikesSent: increment(1)
        });

        console.log('Super Like sent successfully')
        onSend(message)
      } catch (error) {
        console.error('Error sending Super Like:', error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-4">Super Like</h2>
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile.image} alt={profile.name} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
        <p className="text-xl mb-6">Send a Super Like to {profile.name}!</p>
        <div className="bg-gray-700 p-4 rounded mb-4 h-32 overflow-auto">
          {message || "Your message will appear here..."}
        </div>
        <Button 
          onClick={isGenerating ? undefined : message ? handleSend : generateMessage} 
          disabled={isGenerating}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isGenerating ? "Generating..." : message ? "Confirm" : "Generate Message"}
        </Button>
      </div>
    </motion.div>
  )
}

async function fetchUserContext(username: string) {
  console.log('Fetching user context for:', username)
  try {
    const response = await fetch(`/api/twitter-user?username=${username}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('User context fetched successfully:', data)
    return data
  } catch (error) {
    console.error('Error fetching user context:', error)
    throw error
  }
}
