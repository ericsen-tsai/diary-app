/* eslint-disable no-underscore-dangle */
import { headers } from 'next/headers'
import { format } from 'date-fns'

import getTitle from '@/utils/getTitle'
import DiaryDataTable from './(components)/DiaryDataTable'
import { Diary } from './(components)/DiaryDataTable/columns'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function Diary() {
  const res = await fetch('http://localhost:3000/api/diary', {
    headers: headers(),
    cache: 'no-store',
  })

  const diaries = (await res.json()) as Diary[]
  const diariesWithTitle = diaries.map((diary) => ({
    ...diary,
    title:
      getTitle(diary.content)
      || `Diary ${format(diary._creationTime, 'yyyy-MM-dd')}`,
  }))
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className="w-full max-w-[50rem] rounded-md border p-3">
        <DiaryDataTable data={diariesWithTitle} />
      </div>
    </main>
  )
}

export default Diary
