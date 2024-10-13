import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from 'react'
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export function SiteCreditsBar() {
  const [credits, setCredits] = useState(100)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "siteStats", "credits"), (doc) => {
      setCredits(doc.data()?.credits || 0)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full p-2 bg-gray-900">
      <Progress value={credits} max={100} className="w-full" />
      <p className="text-center text-sm mt-1">Site Credits: {credits}</p>
    </div>
  )
}
