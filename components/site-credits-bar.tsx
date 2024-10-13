'use client'

import { useEffect, useState } from 'react'
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

const INITIAL_BALANCE = 100 // $100 initial balance
const COST_PER_SUPER_LIKE = 0.1859 // $0.1859 per super like

export function SiteCreditsBar() {
  const [credits, setCredits] = useState<number>(INITIAL_BALANCE)
  const [superLikesSent, setSuperLikesSent] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "siteStats", "credits"), (doc) => {
      const data = doc.data()
      if (data) {
        const superLikes = data.superLikesSent || 0
        setSuperLikesSent(superLikes)
        const remainingBalance = INITIAL_BALANCE - (superLikes * COST_PER_SUPER_LIKE)
        setCredits(Math.max(0, remainingBalance))
      }
    }, (error) => {
      console.error('Error fetching site stats:', error)
      setError('Failed to load balance')
    })

    return () => unsubscribe()
  }, [])

  const creditsPercentage = (credits / INITIAL_BALANCE) * 100

  return (
    <div className="w-full bg-black text-white text-xs py-1 px-2 fixed top-0 left-0 z-[9999] flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center">
        <div className="w-20 bg-gray-800 rounded-full h-2 mr-2">
          <div 
            className="bg-blue-400 h-2 rounded-full" 
            style={{ width: `${creditsPercentage}%` }}
          ></div>
        </div>
        <span>{error || `$${credits.toFixed(2)}`}</span>
      </div>
      <span>Super Likes: {superLikesSent}</span>
    </div>
  )
}
