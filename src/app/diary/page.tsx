/* eslint-disable no-underscore-dangle */
import { headers } from 'next/headers'
import { format } from 'date-fns'
import DiaryDataTable from './(components)/DiaryDataTable'
import { Diary } from './(components)/DiaryDataTable/columns'

function getTitle(md: string) {
  if (!md) return ''
  const tokens = md.split('\n')
  for (let i = 0; i < tokens.length; i += 1) {
    if (/^#\s+.+/.test(tokens[i])) return tokens[i].split('# ')[1]
  }
  return ''
}

export const dynamic = 'force-dynamic'

async function Diary() {
  const res = await fetch('http://localhost:3000/api/diary', {
    headers: headers(),
    cache: 'no-cache',
  })

  const diaries = (await res.json()) as Diary[]
  const diariesWithTitle = diaries.map((diary) => ({
    ...diary,
    title:
      getTitle(diary.content)
      || `Diary ${format(diary._creationTime, 'yyyy-MM-dd')}`,
  }))
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="min-w-[80vw] rounded-md border p-3">
        <DiaryDataTable data={diariesWithTitle} />
      </div>
    </main>
  )
}

export default Diary
