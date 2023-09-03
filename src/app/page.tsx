'use client'

import { UserButton } from '@clerk/nextjs'
import { useStoreUserEffect } from '@/hooks'

function Home() {
  const userId = useStoreUserEffect()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserButton />
      {userId ?? 'You do not have any id'}
    </main>
  )
}

export default Home
