import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { env } from '@/env.mjs'
import { auth } from '@clerk/nextjs'
import { api } from '../../../../convex/_generated/api'

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)

export async function GET() {
  const { getToken } = auth()
  const token = await getToken({ template: 'convex' })
  convex.setAuth(token || '')
  const diaries = await convex.query(api.diaries.getDiaries)
  return NextResponse.json({ diaries: diaries || [] })
}
