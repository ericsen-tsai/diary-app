/* eslint-disable no-underscore-dangle */

'use client'

import {
  useCallback, useEffect, useRef, useState,
} from 'react'
import { UserButton } from '@clerk/nextjs'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'

import { useDebounce } from '@/hooks'
import { api } from '../../../../convex/_generated/api'
import { type Id } from '../../../../convex/_generated/dataModel'

function Diary() {
  const params = useParams() as { diaryId: Id<'diaries'> }
  const isLoaded = useRef<boolean>(false)
  const diary = useQuery(api.diaries.getDiary, { id: params.diaryId })
  const [source, setSource] = useState<string>('')
  const debouncedSource = useDebounce<string>(source, 1000)
  const updateDiary = useMutation(api.diaries.updateDiary)

  const handleSourceChange = useCallback(() => {
    if (!isLoaded.current || !diary || source === '') {
      return
    }

    void updateDiary({
      content: debouncedSource,
      id: diary._id,
      updatedTime: new Date().getTime(),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSource, updateDiary])

  useEffect(() => {
    handleSourceChange()
  }, [handleSourceChange])

  useEffect(() => {
    if (isLoaded.current || !diary) return
    setSource(diary.content || '')
    isLoaded.current = true
  }, [diary?.content, diary])

  if (!diary) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <UserButton afterSignOutUrl="/sign-in" />
      <p>
        {diary.updatedTime ? 'Updated time' : 'Created time'}
        ：&nbsp;
        {format(
          new Date(diary.updatedTime ?? diary._creationTime),
          'yyyy-MM-dd HH:mm:ss',
        )}
      </p>
      <div className="flex max-h-[80vh] min-w-[80vw] gap-3">
        <textarea
          rows={20}
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
          }}
          className="basis-1/2 rounded-lg bg-slate-50 p-3 text-black"
          placeholder="please enter your content here"
        />
        <MarkdownPreview
          source={source}
          className="basis-1/2 overflow-y-auto rounded-lg p-3 !font-[inherit] [&>ol]:!list-decimal [&>ul]:!list-disc"
          wrapperElement={{
            'data-color-mode': 'light',
          }}
        />
      </div>
    </main>
  )
}

export default Diary
