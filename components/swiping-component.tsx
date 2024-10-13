'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, X, RefreshCw, Home } from "lucide-react"
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  username: string
  profileImage: string
}

const dummyProfiles: Profile[] = [
  { id: '1', name: 'John Doe', username: '@johndoe', profileImage: '/placeholder.svg?height=400&width=400' },
  { id: '2', name: 'Jane Smith', username: '@janesmith', profileImage: '/placeholder.svg?height=400&width=400' },
  { id: '3', name: 'Alice Johnson', username: '@alicej', profileImage: '/placeholder.svg?height=400&width=400' },
]

const INITIAL_CREDITS = 100 // $100 worth of credits
const SWIPE_THRESHOLD = 50 // pixels to trigger a swipe

export function SwipingComponent() {
  const [profiles, setProfiles] = useState(dummyProfiles)
  const [siteCredits, setSiteCredits] = useState(INITIAL_CREDITS)
  const [totalSwipes, setTotalSwipes] = useState(0)
  const router = useRouter()

  // Simulating credit usage over time
  useEffect(() => {
    const interval = setInterval(() => {
      setSiteCredits((prevCredits) => Math.max(prevCredits - 0.01, 0))
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  const [springs, api] = useSprings(profiles.length, i => ({
    x: 0,
    y: 0,
    scale: 1,
    zIndex: profiles.length - i,
  }))

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = Math.abs(velocity[0]) > 0.2
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) {
      handleSwipe(dir > 0 ? 'right' : 'left')
    }
    api.start(i => {
      if (index !== i) return
      const isGone = !down && trigger
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0
      const scale = down ? 1.1 : 1
      return {
        x,
        scale,
        immediate: down,
      }
    })
  })

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on ${profiles[0].name}`)
    setProfiles((prev) => prev.slice(1))
    setTotalSwipes((prevSwipes) => prevSwipes + 1)
    // In a real app, you'd update the server about the swipe action here
  }

  const handleRefresh = () => {
    // In a real app, you'd fetch new profiles here
    setProfiles(dummyProfiles)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const creditsPercentage = (siteCredits / INITIAL_CREDITS) * 100

  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="p-4">
        <Progress value={creditsPercentage} className="w-full" />
        <p className="text-center mt-2">Site Credits: ${siteCredits.toFixed(2)}</p>
        <p className="text-center text-sm text-gray-400">Swipes: {totalSwipes}</p>
      </div>
      
      <div className="flex-grow flex justify-center items-center overflow-hidden">
        {profiles.length > 0 ? (
          springs.map(({ x, y, scale, zIndex }, i) => (
            <animated.div
              key={profiles[i].id}
              style={{
                transform: x.to(x => `translate3d(${x}px,0,0)`),
                scale: scale,
                zIndex: zIndex,
                position: 'absolute',
              }}
              {...bind(i)}
            >
              <div className={cn(
                "bg-gray-800 rounded-xl overflow-hidden shadow-lg",
                isMobile ? "w-[90vw] h-[70vh]" : "w-80 h-96"
              )}>
                <div className="h-3/4 bg-gray-700 flex justify-center items-center">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={profiles[i].profileImage} alt={profiles[i].name} className="object-cover" />
                    <AvatarFallback>{profiles[i].name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{profiles[i].name}</h2>
                  <p className="text-gray-400">{profiles[i].username}</p>
                </div>
              </div>
            </animated.div>
          ))
        ) : (
          <div className="text-center p-4">
            <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
            <p className="text-gray-400 mb-8">You've seen all available profiles.</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleRefresh} className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleGoHome} className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {profiles.length > 0 && (
        <div className="flex justify-center space-x-4 p-4">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full bg-red-500 hover:bg-red-600",
              isMobile ? "w-14 h-14" : "w-16 h-16"
            )}
            onClick={() => handleSwipe('left')}
          >
            <X className={cn(isMobile ? "h-6 w-6" : "h-8 w-8")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full bg-green-500 hover:bg-green-600",
              isMobile ? "w-14 h-14" : "w-16 h-16"
            )}
            onClick={() => handleSwipe('right')}
          >
            <Heart className={cn(isMobile ? "h-6 w-6" : "h-8 w-8")} />
          </Button>
        </div>
      )}
    </div>
  )
}