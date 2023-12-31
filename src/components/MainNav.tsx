/* eslint-disable react/jsx-pascal-case */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          Diarina
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/diary"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/diary')
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Diary
        </Link>
      </nav>
    </div>
  )
}

export default MainNav
