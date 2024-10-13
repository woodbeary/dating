import { signIn } from "next-auth/react"

// ... (rest of the component code)

const handleGetStarted = () => {
  signIn("twitter", { callbackUrl: "/x-dating/swipe" })
}

// ... (rest of the component code)
