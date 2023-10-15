/* eslint-disable no-underscore-dangle */

'use client'

import { useCallback, useEffect, useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { useDebounce } from '@/hooks'
import {
  BookOpen, Clock, FileSignature, Undo2,
} from 'lucide-react'
import Link from 'next/link'
import getTitle from '@/utils/getTitle'
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

  const currentTitle = getTitle(source)
  || `Diary ${format(diary._creationTime, 'yyyy-MM-dd')}`

  return (
    <>
      <div className="flex w-full justify-between text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/diary">
                <Undo2 />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="flex flex-col gap-3">Back to diary</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="max-w-[24rem] truncate text-lg font-bold">
                {currentTitle}
              </h2>
            </TooltipTrigger>
            <TooltipContent>
              <p className="flex flex-col gap-3">{currentTitle}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Clock />
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex flex-col gap-3">
                  <span className="flex items-center gap-1 font-bold">
                    {diary.updatedTime ? 'last updated time' : 'creation time'}
                  </span>
                  {format(
                    new Date(diary.updatedTime ?? diary._creationTime),
                    'yyyy-MM-dd HH:mm:ss',
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit((prev) => !prev)
                  }}
                >
                  {showEdit ? <BookOpen /> : <FileSignature />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex flex-col gap-3">
                  Toggle Reading / Edit Mode
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex max-h-[80vh] min-h-[60vh] w-full gap-1">
        {showEdit && (
          <textarea
            rows={5}
            value={source}
            onChange={(e) => {
              setSource(e.target.value)
            }}
            className="flex-1 overflow-x-auto rounded-lg bg-slate-50 px-6 py-5 text-black"
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
    </>
  )
}

function Diary() {
  const params = useParams()
  const diary = useQuery(api.diaries.getDiary, {
    id: params.diaryId as Id<'diaries'>,
  })

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
