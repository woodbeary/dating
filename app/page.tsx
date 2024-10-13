'use client'

import { XDatingLandingComponent } from "@/components/x-dating-landing";
import { useEffect } from 'react'
import { initializeSiteStats } from '@/lib/firebase'

export default function Home() {
  useEffect(() => {
    console.log("Home: Initializing site stats")
    initializeSiteStats().then(() => {
      console.log("Home: Site stats initialized")
    }).catch((error) => {
      console.error("Home: Error initializing site stats", error)
    })
  }, [])

  return (
    <main>
      <XDatingLandingComponent />
    </main>
  );
}
