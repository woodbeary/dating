'use client'

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface SuperLike {
  id: string;
  recipientId: string;
  recipientName: string;
  message: string;
  sentAt: string;
}

interface Profile {
  id: string;
  name: string;
  username: string;
  image: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [superLikes, setSuperLikes] = useState<SuperLike[]>([])
  const [matches, setMatches] = useState<string[]>([])
  const [matchesToShow, setMatchesToShow] = useState<Profile[]>([])
  const [blockingUser, setBlockingUser] = useState<Profile | null>(null)
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

  useEffect(() => {
    if (session?.user?.id) {
      fetchMatches()
    }
  }, [session])

  const fetchSuperLikes = async () => {
    if (!session?.user?.id) return
    const q = query(collection(db, "superLikes"), where("senderId", "==", session.user.id))
    const querySnapshot = await getDocs(q)
    const likes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuperLike))
    setSuperLikes(likes)
  }

  const fetchMatches = async () => {
    if (!session?.user?.id) return
    const userRef = doc(db, "users", session.user.id)
    const userDoc = await getDoc(userRef)
    const userData = userDoc.data()
    const matchIds = userData?.matches || []

    const matchPromises = matchIds.map(async (id: string) => {
      const matchRef = doc(db, "users", id)
      const matchDoc = await getDoc(matchRef)
      if (matchDoc.exists()) {
        return { id, ...matchDoc.data() } as Profile
      }
      return null
    })

    const matches = (await Promise.all(matchPromises)).filter((match): match is Profile => match !== null)
    setMatchesToShow(matches)
  }

  const handleBlock = async (userId: string) => {
    if (!session?.user?.id) return
    const confirmed = window.confirm("Are you sure you want to block this user?")
    if (confirmed) {
      await updateDoc(doc(db, "users", session.user.id), {
        [`blocked.${userId}`]: true,
        matches: matchesToShow.filter(match => match.id !== userId).map(match => match.id)
      })
      setMatchesToShow(prev => prev.filter(match => match.id !== userId))
      setSuperLikes(prev => prev.filter(like => like.recipientId !== userId))
      window.open(`https://twitter.com/intent/user?user_id=${userId}`, '_blank')
      setBlockingUser(null) // Close the dialog after blocking
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === "loading" || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
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
      <Button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Log Out
      </Button>
      <h3 className="text-xl font-bold mt-8 mb-4">Your Matches</h3>
      {matchesToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {matchesToShow.map(match => (
            <div key={match.id} className="bg-gray-800 p-4 rounded-xl">
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src={match.image} alt={match.name} />
                <AvatarFallback>{match.name[0]}</AvatarFallback>
              </Avatar>
              <h4 className="text-lg font-semibold">{match.name}</h4>
              <p className="text-gray-400 mb-2">{match.username}</p>
              <Button 
                onClick={() => window.open(`https://twitter.com/messages/compose?recipient_id=${match.username.slice(1)}`, '_blank')}
                className="w-full mb-2"
              >
                Message
              </Button>
              <Button 
                onClick={() => handleBlock(match.id)} 
                variant="destructive" 
                className="w-full"
              >
                Block
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No matches yet. Keep swiping!</p>
      )}
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
      <Dialog open={!!blockingUser} onOpenChange={() => setBlockingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {blockingUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockingUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => blockingUser && handleBlock(blockingUser.id)}>Block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
