'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, X, RefreshCw, Home } from "lucide-react"
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export function SwipingComponent() {
  const { data: session } = useSession()
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="p-4 flex items-center justify-between">
        <Button onClick={handleGoHome} variant="ghost" size="icon">
          <Home className="h-6 w-6" />
        </Button>
        {session?.user && (
          <div className="flex items-center">
            <Avatar className="mr-2">
              <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
              <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{session.user.name}</span>
          </div>
        )}
      </div>
      
      <div className="flex-grow flex justify-center items-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to X Dating!</h2>
          <p className="text-gray-400 mb-8">Swiping functionality coming soon.</p>
        </div>
      </div>
    </div>
  )
}
