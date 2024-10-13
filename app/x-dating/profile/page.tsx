'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase" // Ensure this import path is correct
import { doc, setDoc, getDoc } from "firebase/firestore"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const fetchOrCreateUserProfile = async () => {
        const userRef = doc(db, "users", session.user.id)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setUserProfile(userSnap.data())
        } else {
          const newUserProfile = {
            id: session.user.id,
            name: session.user.name,
            image: session.user.image,
            createdAt: new Date().toISOString(),
          }
          await setDoc(userRef, newUserProfile)
          setUserProfile(newUserProfile)
        }
      }

      fetchOrCreateUserProfile()
    } else if (status === "unauthenticated") {
      router.push('/')
    }
  }, [status, session, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!userProfile) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <img src={userProfile.image} alt={userProfile.name} className="w-32 h-32 rounded-full mb-4" />
      <h2 className="text-2xl mb-4">{userProfile.name}</h2>
      <p>Account created: {new Date(userProfile.createdAt).toLocaleDateString()}</p>
      <Button 
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-4"
        onClick={() => router.push('/x-dating/swipe')}
      >
        Start Swiping
      </Button>
    </div>
  )
}
