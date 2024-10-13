'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function HowItWorksPage() {
  const handleJoinWaitlist = () => {
    signIn("twitter", { callbackUrl: "/x-dating/waitlist" })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">How 𝕏 Dating Works</h1>
      <div className="max-w-2xl text-center mb-8">
        <p className="mb-4">
          𝕏 Dating uses advanced AI algorithms to match you with compatible partners based on your 𝕏 activity, interests, and preferences.
        </p>
        <p className="mb-4">
          1. Sign up with your 𝕏 account
        </p>
        <p className="mb-4">
          2. Our AI analyzes your profile and tweets
        </p>
        <p className="mb-4">
          3. Get matched with compatible 𝕏 users
        </p>
        <p className="mb-4">
          4. Start chatting and find your perfect match!
        </p>
      </div>
      <Button 
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-8 text-xl font-bold"
        onClick={handleJoinWaitlist}
      >
        Join Waitlist
      </Button>
    </div>
  )
}
