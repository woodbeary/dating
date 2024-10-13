'use client'

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore"

interface SuperLike {
  id: string;
  recipientId: string;
  recipientName: string;
  message: string;
  sentAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [superLikes, setSuperLikes] = useState<SuperLike[]>([])
  const [matches, setMatches] = useState<string[]>([])
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
      fetchSuperLikes()
    } else if (status === "unauthenticated") {
      router.push('/')
    }
  }, [status, session, router])

  const fetchSuperLikes = async () => {
    if (!session?.user?.id) return
    const q = query(collection(db, "superLikes"), where("senderId", "==", session.user.id))
    const querySnapshot = await getDocs(q)
    const likes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuperLike))
    setSuperLikes(likes)
  }

  const handleBlock = async (userId: string) => {
    if (!session?.user?.id) return
    const confirmed = window.confirm("Are you sure you want to block this user?")
    if (confirmed) {
      await updateDoc(doc(db, "users", session.user.id), {
        [`blocked.${userId}`]: true
      })
      // Remove from matches and superLikes
      setMatches(prevMatches => prevMatches.filter(match => match !== userId))
      setSuperLikes(prevSuperLikes => prevSuperLikes.filter(like => like.recipientId !== userId))
      window.open(`https://twitter.com/intent/user?user_id=${userId}`, '_blank')
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!userProfile) {
    return <div>Loading profile...</div>
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <img src={userProfile.image} alt={userProfile.name} className="w-32 h-32 rounded-full mb-4" />
      <h2 className="text-2xl mb-4">{userProfile.name}</h2>
      <Button 
        onClick={() => router.push('/x-dating/swipe')}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Start Swiping
      </Button>
      <Button 
        onClick={handleLogout} 
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </Button>
      <h3 className="text-xl font-bold mt-8 mb-4">Your Matches</h3>
      {/* ... existing matches rendering ... */}
      <h3 className="text-xl font-bold mt-8 mb-4">Your Super Likes</h3>
      {superLikes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {superLikes.map(like => (
            <div key={like.id} className="bg-gray-800 p-4 rounded-xl">
              <h4 className="text-lg font-semibold">{like.recipientName}</h4>
              <p className="text-gray-400 mb-2">{like.message}</p>
              <p className="text-sm text-gray-500">Sent on {new Date(like.sentAt).toLocaleDateString()}</p>
              <Button onClick={() => handleBlock(like.recipientId)} variant="destructive" className="mt-2">
                Block
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't sent any Super Likes yet.</p>
      )}
    </div>
  )
}
