import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from 'react'
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export function SiteCreditsBar() {
  const [credits, setCredits] = useState(100)
  const [superLikesSent, setSuperLikesSent] = useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "siteStats", "credits"), (doc) => {
      const data = doc.data()
      if (data) {
        setCredits(data.credits || 0)
        setSuperLikesSent(data.superLikesSent || 0)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full p-2 bg-gray-900 text-white fixed top-0 left-0 z-[9999]">
      <Progress value={credits} max={100} className="w-full mb-1" />
      <div className="flex justify-between text-sm">
        <p>XAI Credits: ${credits.toFixed(2)}</p>
        <p>Super Likes Sent: {superLikesSent}</p>
      </div>
    </div>
  )
}
