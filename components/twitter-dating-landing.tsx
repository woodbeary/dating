'use client'

import { Bell, Bookmark, ChevronRight, Hash, Heart, Home, Mail, MessageCircle, MoreHorizontal, Search, User, Users, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function TwitterDatingLandingComponent() {
  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans">
      {/* Left Sidebar */}
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
              disabled={item.label !== "Dating"}
              className={cn(
                "w-full justify-start text-xl rounded-full relative",
                item.label === "Dating" ? "bg-gray-800 text-white animate-pulse" : "opacity-50"
              )}
            >
              <item.icon className="mr-4 h-6 w-6" />
              {item.label}
              {item.label === "Dating" && (
                <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-bounce h-5 w-5" />
              )}
            </Button>
          ))}
        </nav>
        <Button disabled className="w-full mt-4 bg-blue-500 text-white rounded-full py-3 text-xl font-bold opacity-50">Post</Button>
        <div className="mt-auto flex items-center space-x-2 opacity-50">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">User</p>
            <p className="text-gray-500">@user</p>
          </div>
          <Button variant="ghost" size="icon" disabled><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 border-x border-gray-800">
        <header className="p-4 border-b border-gray-800 flex space-x-12">
          <Button variant="ghost" disabled className="text-lg font-semibold text-gray-500 opacity-50">For you</Button>
          <Button variant="ghost" disabled className="text-lg font-semibold text-gray-500 opacity-50">Following</Button>
        </header>
        <div className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input disabled className="w-full bg-transparent border-none text-xl text-white placeholder-gray-600 opacity-50" placeholder="What is happening?!" />
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {[Hash, Bell, Mail, User].map((Icon, index) => (
                    <Button key={index} variant="ghost" size="icon" disabled className="text-blue-400 opacity-50">
                      <Icon className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
                <Button size="sm" disabled className="bg-blue-500 text-white rounded-full px-4 py-2 opacity-50">Post</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 p-4">
        <Input disabled className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-full py-2 px-4 mb-4 opacity-50" placeholder="Search" />
        <div className="bg-gray-900 rounded-xl p-4 mb-4 opacity-50">
          <h2 className="text-xl font-bold mb-4">Live on X</h2>
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
        <div className="bg-gray-900 rounded-xl p-4 opacity-50">
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
          <Button variant="ghost" disabled className="w-full text-blue-400 mt-4">Show more</Button>
        </div>
      </div>
    </div>
  )
}