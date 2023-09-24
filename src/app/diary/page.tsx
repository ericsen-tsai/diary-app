import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

async function Diary() {
  const diaries = await fetch('http://localhost:3000/api/diary', {
    headers: headers(),
    cache: 'no-cache',
  })

  console.log(await diaries.json())
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      Hello
    </main>
  )
}

export default Diary
