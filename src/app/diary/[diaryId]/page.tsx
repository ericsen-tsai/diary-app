'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import MarkdownPreview from '@uiw/react-markdown-preview'

function Diary() {
  const [source, setSource] = useState<string>('')
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <UserButton afterSignOutUrl="/sign-in" />
      <div className="flex min-w-[80vw] gap-3">
        <textarea
          rows={20}
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
          }}
          className="basis-1/2 text-black"
        />
        <MarkdownPreview source={source} className="basis-1/2" />
      </div>
    </main>
  )
}

export default Diary
