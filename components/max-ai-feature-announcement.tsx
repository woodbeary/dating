'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MaxAIFeatureAnnouncement() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white">
          Discover Ma𝕏
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Introducing Ma𝕏</DialogTitle>
          <DialogDescription>
            Coming soon to 𝕏 Dating: Discover 'the one' with our new feature that leverages advanced AI to match you based on deep compatibility.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={() => setIsOpen(false)}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
