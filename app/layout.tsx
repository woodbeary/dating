import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "𝕏 Dating",
  description: "Find your perfect match on 𝕏",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <Providers>
          <main>
            {children}
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
