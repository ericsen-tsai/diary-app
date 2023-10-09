import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ConvexClientProvider, ThemeProvider, SiteHeader } from '@/components'
import { ClerkProvider } from '@clerk/nextjs'
import { env } from '@/env.mjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Diarina',
  description: 'Note yourself',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
