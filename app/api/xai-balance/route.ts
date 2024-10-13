import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const INITIAL_BALANCE = 100 // $100 initial balance
const COST_PER_SUPER_LIKE = 0.1859 // $0.1859 per super like

export async function GET() {
  try {
    const siteStatsRef = doc(db, "siteStats", "credits")
    const siteStatsDoc = await getDoc(siteStatsRef)
    
    if (siteStatsDoc.exists()) {
      const data = siteStatsDoc.data()
      const superLikesSent = data.superLikesSent || 0
      const totalUsage = superLikesSent * COST_PER_SUPER_LIKE
      const remainingBalance = INITIAL_BALANCE - totalUsage

      return NextResponse.json({ remainingBalance, totalUsage, superLikesSent })
    } else {
      return NextResponse.json({ remainingBalance: INITIAL_BALANCE, totalUsage: 0, superLikesSent: 0 })
    }
  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
  }
}
