'use client'

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, X, Star, Home, Loader2, GitPullRequest } from "lucide-react"
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { MatchComponent } from './match-component'
import { SuperLikeModal } from './super-like-modal'

interface Profile {
  id: string
  name: string
  username: string
  image: string
}

const SWIPE_THRESHOLD = 150 // Increased threshold for less sensitivity

export function SwipingComponent() {
  const { data: session } = useSession()
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)
  const [showSuperLikeModal, setShowSuperLikeModal] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [session])

  const fetchProfiles = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    const userRef = doc(db, "users", session.user.id)
    const userDoc = await getDoc(userRef)
    const userData = userDoc.data()

    const q = query(collection(db, "users"), where("id", "!=", session.user.id))
    const querySnapshot = await getDocs(q)
    
    const fetchedProfiles: Profile[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Profile
      if (!userData?.swipes || !userData.swipes[data.id]) {
        fetchedProfiles.push(data)
      }
    })

    setProfiles(fetchedProfiles)
    setIsLoading(false)
  }

  const [springs, api] = useSprings(profiles.length, i => ({
    x: 0,
    y: 0,
    scale: 1,
    zIndex: profiles.length - i,
  }))

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = Math.abs(mx) > SWIPE_THRESHOLD
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
          setMatchedProfile(profile)
        }
      }
    }

    setProfiles(prev => prev.filter(p => p.id !== profile.id))
  }

  const handleGoHome = () => {
    router.push('/x-dating/profile')
  }

  const handleSuperLike = (profile: Profile) => {
    setCurrentProfile(profile)
    setShowSuperLikeModal(true)
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
        {isLoading ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        ) : profiles.length > 0 ? (
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
                isMobile ? "w-[90vw] h-[60vh]" : "w-80 h-96"
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
            className="rounded-full bg-blue-500 hover:bg-blue-600 w-16 h-16"
            onClick={() => handleSuperLike(profiles[0])}
          >
            <GitPullRequest className="h-8 w-8" />
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

      {matchedProfile && (
        <MatchComponent
          profile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
        />
      )}

      {showSuperLikeModal && currentProfile && (
        <SuperLikeModal
          profile={currentProfile}
          onClose={() => setShowSuperLikeModal(false)}
          onSend={(message: string) => {
            handleSwipe('right', currentProfile)
            setShowSuperLikeModal(false)
          }}
        />
      )}
    </div>
  )
}
