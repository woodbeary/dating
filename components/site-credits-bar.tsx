import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from 'react'
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export function SiteCreditsBar() {
  const [credits, setCredits] = useState<number | null>(null)
  const [superLikesSent, setSuperLikesSent] = useState<number | null>(null)

  useEffect(() => {
    console.log("SiteCreditsBar: Initializing Firestore listener")
    const unsubscribe = onSnapshot(doc(db, "siteStats", "credits"), (doc) => {
      console.log("SiteCreditsBar: Received Firestore update", doc.data())
      const data = doc.data()
      if (data) {
        setCredits(data.credits || 0)
        setSuperLikesSent(data.superLikesSent || 0)
      }
    }, (error) => {
      console.error("SiteCreditsBar: Firestore listener error", error)
    })

    return () => {
      console.log("SiteCreditsBar: Unsubscribing from Firestore listener")
      unsubscribe()
    }
  }, [])

  console.log("SiteCreditsBar: Rendering with credits:", credits, "superLikes:", superLikesSent)

  return (
    <div className="w-full p-4 bg-blue-600 text-white fixed top-0 left-0 z-[9999]">
      <Progress value={credits ?? 0} max={100} className="w-full mb-2 h-4 bg-blue-300" />
      <div className="flex justify-between text-sm font-bold">
        <p>XAI Credits: ${credits !== null ? credits.toFixed(2) : '0.00'}</p>
        <p>Super Likes Sent: {superLikesSent !== null ? superLikesSent : 0}</p>
      </div>
    </div>
  )
}
