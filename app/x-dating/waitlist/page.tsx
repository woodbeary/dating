'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function WaitlistPage() {
  const { data: session, status } = useSession()
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      // Here you would typically make an API call to your backend
      // to get the user's position in the waitlist
      // For now, we'll just set a random number
      setWaitlistPosition(Math.floor(Math.random() * 1000) + 1)
    } else if (status === "unauthenticated") {
      router.push('/') // Redirect to home if not authenticated
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">𝕏 Dating Waitlist</h1>
      {waitlistPosition && (
        <p className="text-2xl mb-4">Your position in the waitlist: {waitlistPosition}</p>
      )}
      <p className="text-xl mb-8 text-center">Thank you for joining the waitlist! We'll notify you when 𝕏 Dating goes live.</p>
      <Button 
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-8 text-xl font-bold"
        onClick={() => router.push('/')}
      >
        Back to Home
      </Button>
    </div>
  )
}
