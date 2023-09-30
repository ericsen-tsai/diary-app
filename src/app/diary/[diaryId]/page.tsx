/* eslint-disable no-underscore-dangle */

'use client'

import {
  useCallback, useEffect, useState,
} from 'react'
import { UserButton } from '@clerk/nextjs'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'

import { useDebounce } from '@/hooks'
import { api } from '../../../../convex/_generated/api'
import { type Doc, type Id } from '../../../../convex/_generated/dataModel'

function EditArea({ diary }: { diary: Doc<'diaries'> }) {
  const [source, setSource] = useState<string>(diary.content)
  const debouncedSource = useDebounce<string>(source, 1000)
  const updateDiary = useMutation(api.diaries.updateDiary)

  const handleSourceChange = useCallback(() => {
    if (source === '') {
      return
    }

    void updateDiary({
      content: debouncedSource,
      id: diary._id,
      updatedTime: new Date().getTime(),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSource, updateDiary, diary._id])

  useEffect(() => {
    handleSourceChange()
  }, [handleSourceChange])

  return (
    <>
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
    </>
  )
}

function Diary() {
  const params = useParams() as { diaryId: Id<'diaries'> }
  const diary = useQuery(api.diaries.getDiary, { id: params.diaryId })

  if (!diary) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <UserButton afterSignOutUrl="/sign-in" />
      {diary && <EditArea diary={diary} />}
    </main>
  )
}

export default Diary
