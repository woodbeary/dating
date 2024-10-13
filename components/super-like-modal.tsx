import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { doc, updateDoc, increment, setDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"

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
    // Simulate Grok AI message generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setMessage("Hey there! I couldn't help but notice your profile. Want to chat?")
    setIsGenerating(false)
  }

  const handleSend = async () => {
    if (message && session?.user?.id) {
      await updateDoc(doc(db, "siteStats", "credits"), {
        credits: increment(-1)
      })
      await setDoc(doc(db, "superLikes", `${session.user.id}_${profile.id}`), {
        senderId: session.user.id,
        recipientId: profile.id,
        message,
        sentAt: new Date().toISOString()
      })
      onSend(message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4">Super Like</h2>
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile.image} alt={profile.name} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
        <p className="text-xl mb-6">Send a Super Like to {profile.name}!</p>
        <Button onClick={generateMessage} disabled={isGenerating} className="mb-4">
          {isGenerating ? "Generating..." : "Generate Message"}
        </Button>
        <div className="bg-gray-700 p-4 rounded mb-4 h-32 overflow-auto">
          {message || "Your message will appear here..."}
        </div>
        <div className="space-y-4">
          <Button onClick={handleSend} disabled={!message} className="w-full">
            Send Super Like
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
