import { headers } from 'next/headers'
import DiaryList, { Diary } from './(components)/DiaryList'

export const dynamic = 'force-dynamic'

async function Diary() {
  const res = await fetch('http://localhost:3000/api/diary', {
    headers: headers(),
    cache: 'no-cache',
  })

  const diaries = (await res.json()) as Diary[]

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <DiaryList diaries={diaries} />
    </main>
  )
}

export default Diary
