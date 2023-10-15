'use client'

import ThemeModeToggle from '@/components/ThemeModeToggle'
import MainNav from '@/components/MainNav'
import MobileNav from '@/components/MobileNav'
import { UserButton, SignInButton } from '@clerk/nextjs'
import { UserCircle2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="ml-auto flex items-center">
            <ThemeModeToggle />
          </nav>
          <nav className="relative flex h-[32px] w-[32px] items-center">
            <div className="relative z-10">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
            <div className="absolute right-0 top-0 z-0 h-full w-full">
              <SignInButton afterSignInUrl="/diary">
                <Button size="icon" variant="ghost" className="h-full w-full" disabled={pathname === '/sign-in'}>
                  <UserCircle2 />
                </Button>
              </SignInButton>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
