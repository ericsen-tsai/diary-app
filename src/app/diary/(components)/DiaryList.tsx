/* eslint-disable no-underscore-dangle */

'use client'

import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Doc } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'

export type Diary = Doc<'diaries'>

function getTitle(md: string) {
  if (!md) return ''
  const tokens = md.split('\n')
  for (let i = 0; i < tokens.length; i += 1) {
    if (/^#\s+.+/.test(tokens[i])) return tokens[i].split('# ')[1]
  }
  return ''
}

function DiaryList({ diaries }: { diaries: Diary[] }) {
  const createDiary = useMutation(api.diaries.createDiary)
  const router = useRouter()

  const handleCreateDiary = async () => {
    const newDiaryId = await createDiary()
    router.push(`/diary/${newDiaryId}`)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          void handleCreateDiary()
        }}
      >
        create diary
      </button>
      <ul>
        {diaries.map((diary) => (
          <li key={diary._id} className="flex gap-3">
            <p>{getTitle(diary.content) || `Diary ${diary._creationTime}}`}</p>
            <Link href={`/diary/${diary._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DiaryList
