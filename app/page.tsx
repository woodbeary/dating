'use client'

import { XDatingLandingComponent } from "@/components/x-dating-landing";
import { useEffect } from 'react'
import { initializeSiteStats } from '@/lib/firebase'

export default function Home() {
  useEffect(() => {
    initializeSiteStats()
  }, [])

  return (
    <main>
      <XDatingLandingComponent />
    </main>
  );
}
