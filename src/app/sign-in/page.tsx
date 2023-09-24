'use client'

import { useEffect } from 'react'
import { UserButton, useSignIn, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

function SignIn() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()
  useEffect(() => {
    if (isLoaded && Object.keys(signIn?.userData || {}).length !== 0) {
      router.push('/diary')
    }
  }, [isLoaded, router, signIn?.userData])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignInButton mode="modal" />
      <UserButton />
    </main>
  )
}

export default SignIn
