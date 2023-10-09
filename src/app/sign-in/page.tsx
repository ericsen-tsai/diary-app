'use client'

import { useEffect } from 'react'
import { useUser, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

function SignIn() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/diary')
    }
  }, [isLoaded, router, isSignedIn])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignInButton mode="modal" afterSignInUrl="/diary">
        <Button className="rounded-[0.5rem]">Sign in with Clerk</Button>
      </SignInButton>
    </main>
  )
}

export default SignIn
