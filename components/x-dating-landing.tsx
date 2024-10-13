'use client'

import { useState, useEffect } from 'react'
import { Bell, Bookmark, ChevronRight, Hash, Heart, Home, Mail, MessageCircle, MoreHorizontal, Search, User, Users, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import { useMediaQuery } from 'react-responsive'

const xDatingFeatures = [
  {
    title: "xAI Powered Dating",
    description: "Our advanced matching algorithm uses xAI to find your perfect match.",
    icon: Heart,
  },
  {
    title: "Grok Enabled Wingman",
    description: "Get smart suggestions for super likes with our AI assistant.",
    icon: Zap,
  },
  {
    title: "𝕏 Features Available",
    description: "Filter matches by verification badge and other 𝕏-exclusive features.",
    icon: User,
  },
  {
    title: "Start Swiping!",
    description: "Jump right in and start finding your perfect match today!",
    icon: ChevronRight,
  },
]

export function XDatingLandingComponent() {
  const [selectedTab, setSelectedTab] = useState('𝕏 Dating')
  const [currentFeature, setCurrentFeature] = useState(0)
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })

  const nextFeature = () => setCurrentFeature((prev) => (prev + 1) % xDatingFeatures.length)
  const prevFeature = () => setCurrentFeature((prev) => (prev - 1 + xDatingFeatures.length) % xDatingFeatures.length)

  const handleGetStarted = () => {
    signIn("twitter", { callbackUrl: "/x-dating/swipe" })
  }

  return (
    <div className={cn(
      "flex bg-black text-gray-200 font-sans min-h-screen",
      isMobile ? "flex-col" : ""
    )}>
      {/* Left Sidebar - Hide on mobile */}
      {!isMobile && (
        <div className="w-64 p-4 flex flex-col">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white mb-6" fill="currentColor">
            <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
          </svg>
          <nav className="space-y-2">
            {[
              { icon: Home, label: "Home" },
              { icon: Search, label: "Explore" },
              { icon: Bell, label: "Notifications" },
              { icon: Mail, label: "Messages" },
              { icon: MessageCircle, label: "Grok" },
              { icon: Zap, label: "Premium" },
              { icon: Heart, label: "Dating" },
              { icon: Bookmark, label: "Bookmarks" },
              { icon: Users, label: "Communities" },
              { icon: User, label: "Profile" },
              { icon: MoreHorizontal, label: "More" },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-xl rounded-full",
                  item.label === "Dating" ? "bg-gray-800 text-white" : "text-gray-400"
                )}
                onClick={() => item.label === "Dating" && setSelectedTab("𝕏 Dating")}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.label}
                {item.label === "Dating" && (
                  <ChevronRight className="ml-auto h-5 w-5" />
                )}
              </Button>
            ))}
          </nav>
          <Button className="w-full mt-4 bg-blue-500 text-white rounded-full py-3 text-xl font-bold">Post</Button>
          <div className="mt-auto flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">User</p>
              <p className="text-gray-500">@user</p>
            </div>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        "flex-1 border-x border-gray-800 overflow-y-auto",
        isMobile && "border-x-0"
      )}>
        <header className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 flex space-x-4 overflow-x-auto">
          <Button 
            variant="ghost" 
            className={cn("text-lg font-semibold whitespace-nowrap", selectedTab === "For you" ? "text-white" : "text-gray-500")}
            onClick={() => setSelectedTab("For you")}
          >
            For you
          </Button>
          <Button 
            variant="ghost" 
            className={cn("text-lg font-semibold whitespace-nowrap", selectedTab === "Following" ? "text-white" : "text-gray-500")}
            onClick={() => setSelectedTab("Following")}
          >
            Following
          </Button>
          <Button 
            variant="ghost" 
            className={cn("text-lg font-semibold whitespace-nowrap", selectedTab === "𝕏 Dating" ? "text-white" : "text-gray-500")}
          >
            𝕏 Dating
          </Button>
        </header>
        <div className="p-4 pb-20">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-8">𝕏 Dating</h1>
            <div className={cn(
              "relative w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-8",
              isMobile && "max-w-full"
            )}>
              {xDatingFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300",
                    index === currentFeature ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <feature.icon className="w-20 h-20 mb-6 text-blue-400" />
                  <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
                  <p className="text-center text-gray-300 text-lg">{feature.description}</p>
                </div>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2"
                onClick={prevFeature}
              >
                <ChevronRight className="h-8 w-8 rotate-180" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={nextFeature}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
            <div className="flex justify-center mb-8 space-x-2">
              {xDatingFeatures.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    index === currentFeature ? "bg-blue-400" : "bg-gray-600"
                  )}
                />
              ))}
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-8 text-xl font-bold w-full max-w-sm"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hide on mobile */}
      {!isMobile && (
        <div className="w-96 p-4 overflow-y-auto">
          <Input className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-full py-2 px-4 mb-4" placeholder="Search" />
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Live on 𝕏</h2>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">User <span className="text-blue-400">✓</span></p>
                <p className="text-sm text-gray-500">is co-hosting</p>
              </div>
            </div>
            <p className="mt-2 font-semibold">Live stream title</p>
            <div className="flex items-center mt-2">
              <Avatar className="w-6 h-6 border-2 border-gray-900">
                <AvatarImage src="/placeholder.svg?height=24&width=24" alt="User 1" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar className="-ml-2 w-6 h-6 border-2 border-gray-900">
                <AvatarImage src="/placeholder.svg?height=24&width=24" alt="User 2" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar className="-ml-2 w-6 h-6 border-2 border-gray-900">
                <AvatarImage src="/placeholder.svg?height=24&width=24" alt="User 3" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm text-gray-500">+3</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Explore</h2>
              <span className="text-xs font-semibold bg-gray-800 text-gray-400 px-2 py-1 rounded">Beta</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Trending now · Technology</p>
                <p className="font-semibold">Trending Topic 1</p>
                <p className="text-sm text-gray-500">1.8K posts</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trending now · Event</p>
                <p className="font-semibold">Trending Topic 2</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">2 hours ago · Category</p>
                <p className="font-semibold">Trending Topic 3</p>
                <p className="text-sm text-gray-500">36K posts</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trending now · Category</p>
                <p className="font-semibold">Trending Topic 4</p>
                <p className="text-sm text-gray-500">2.2K posts</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full text-blue-400 mt-4">Show more</Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-2 z-20">
          <Button variant="ghost" size="icon"><Home className="h-6 w-6" /></Button>
          <Button variant="ghost" size="icon"><Search className="h-6 w-6" /></Button>
          <Button variant="ghost" size="icon"><Bell className="h-6 w-6" /></Button>
          <Button variant="ghost" size="icon"><Mail className="h-6 w-6" /></Button>
        </nav>
      )}
    </div>
  )
}