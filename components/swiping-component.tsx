'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, X, RefreshCw, Home } from "lucide-react"
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"

interface Profile {
  id: string
  name: string
  username: string
  image: string
}

const SWIPE_THRESHOLD = 100 // pixels to trigger a swipe

export function SwipingComponent() {
  const { data: session } = useSession()
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    // Fetch profiles from Firestore
    const fetchProfiles = async () => {
      // Implement fetching logic here
      // For now, we'll use dummy data
      setProfiles([
        { id: '1', name: 'User 1', username: '@user1', image: '/placeholder.svg' },
        { id: '2', name: 'User 2', username: '@user2', image: '/placeholder.svg' },
        { id: '3', name: 'User 3', username: '@user3', image: '/placeholder.svg' },
      ])
    }
    fetchProfiles()
  }, [])

  const [springs, api] = useSprings(profiles.length, i => ({
    x: 0,
    y: 0,
    scale: 1,
    zIndex: profiles.length - i,
  }))

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = Math.abs(vx) > 0.2
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) {
      handleSwipe(dir > 0 ? 'right' : 'left', profiles[index])
    }
    api.start(i => {
      if (index !== i) return
      const isGone = !down && trigger
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0
      const scale = down ? 1.1 : 1
      return {
        x,
        scale,
        zIndex: profiles.length - i,
        immediate: down,
      }
    })
  })

  const handleSwipe = async (direction: 'left' | 'right', profile: Profile) => {
    if (!session?.user?.id) return

    const userRef = doc(db, "users", session.user.id)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        [`swipes.${profile.id}`]: direction === 'right',
      })

      // Check for a match if swiped right
      if (direction === 'right') {
        const swipedUserRef = doc(db, "users", profile.id)
        const swipedUserDoc = await getDoc(swipedUserRef)
        if (swipedUserDoc.exists() && swipedUserDoc.data().swipes?.[session.user.id]) {
          // It's a match!
          await updateDoc(userRef, {
            matches: arrayUnion(profile.id)
          })
          await updateDoc(swipedUserRef, {
            matches: arrayUnion(session.user.id)
          })
          console.log("It's a match!")
        }
      }
    }

    setProfiles(prev => prev.filter(p => p.id !== profile.id))
  }

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
                    <AvatarImage src={profiles[i].image} alt={profiles[i].name} className="object-cover" />
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
          </div>
        )}
      </div>
      
      {profiles.length > 0 && (
        <div className="flex justify-center space-x-4 p-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-red-500 hover:bg-red-600 w-16 h-16"
            onClick={() => handleSwipe('left', profiles[0])}
          >
            <X className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-green-500 hover:bg-green-600 w-16 h-16"
            onClick={() => handleSwipe('right', profiles[0])}
          >
            <Heart className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  )
}
