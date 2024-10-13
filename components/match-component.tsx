import React from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MatchComponentProps {
  profile: {
    name: string
    username: string
    image: string
  }
  onClose: () => void
}

export function MatchComponent({ profile, onClose }: MatchComponentProps) {
  const handleMessage = () => {
    window.open(`https://twitter.com/messages/compose?recipient_id=${profile.username.slice(1)}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <Confetti />
      <div className="bg-gray-800 p-8 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">It's a Match!</h2>
        <Avatar className="w-32 h-32 mx-auto mb-4">
          <AvatarImage src={profile.image} alt={profile.name} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
        <p className="text-xl mb-6">You and {profile.name} liked each other!</p>
        <div className="space-y-4">
          <Button onClick={handleMessage} className="w-full">
            Message on Twitter
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full">
            Keep Swiping
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
