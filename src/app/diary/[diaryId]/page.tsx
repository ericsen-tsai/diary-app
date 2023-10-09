/* eslint-disable no-underscore-dangle */

'use client'

import {
  useCallback, useEffect, useState,
} from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'

import { useDebounce } from '@/hooks'
import { Clock } from 'lucide-react'
import { api } from '../../../../convex/_generated/api'
import { type Doc, type Id } from '../../../../convex/_generated/dataModel'

function EditArea({ diary }: { diary: Doc<'diaries'> }) {
  const [source, setSource] = useState<string>(diary.content)
  const [showEdit, setShowEdit] = useState<boolean>(true)
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
      <p className="ml-auto flex flex-col items-center text-sm">
        <span className="flex items-center gap-1 font-bold">
          <Clock size={12} strokeWidth={3} />
          {diary.updatedTime ? 'updated time' : 'creation time'}
        </span>
        {format(
          new Date(diary.updatedTime ?? diary._creationTime),
          'yyyy-MM-dd HH:mm:ss',
        )}
      </p>
      <div className="flex max-h-[80vh] min-h-[60vh] min-w-[80vw] gap-3">
        {showEdit && (
        <textarea
          rows={5}
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
          }}
          className="flex-1 rounded-lg bg-slate-50 px-6 py-5 text-black"
          placeholder="please enter your content here"
        />
        )}
        <MarkdownPreview
          source={source}
          className="flex-1 self-stretch overflow-y-auto rounded-lg px-6 py-5 !font-[inherit] [&>ol]:!list-decimal [&>ul]:!list-disc"
          wrapperElement={{
            'data-color-mode': 'light',
          }}
        />
      </div>
      <button type="button" onClick={() => { setShowEdit((prev) => !prev) }}>
        Turn
        {' '}
        {showEdit ? 'On' : 'Off'}
        {' '}
        Reading Mode
      </button>
    </>
  )
}

function Diary() {
  const params = useParams()
  const diary = useQuery(api.diaries.getDiary, { id: params.diaryId as Id<'diaries'> })

  if (!diary) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      {diary && <EditArea diary={diary} />}
    </main>
  )
}

export default Diary
