import { SwipingComponent } from "@/components/swiping-component"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function SwipePage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  return (
    <main>
      <SwipingComponent />
    </main>
  )
}
