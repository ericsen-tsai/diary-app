'use client'

import { type ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'

import { env } from '@/env.mjs'

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
