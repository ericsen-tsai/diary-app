/* eslint-disable no-underscore-dangle */
import { v } from 'convex/values'
import { type Id } from './_generated/dataModel'
import {
  mutation,
  query,
  type QueryCtx,
  type MutationCtx,
} from './_generated/server'

type Context = QueryCtx | MutationCtx

const isAuthed = <T, P extends Record<string, unknown>, C extends Context>(
  next: (ctx: C & { userId: Id<'users'> }, args: P) => Promise<T> | T,
) => async (ctx: C, args: P) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error(`Called ${next.name} without authentication present`)
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new Error('Unrecognized user')
    }

    return next({ ...ctx, userId: user._id }, args)
  }

export const getDiaries = query({
  args: {},
  handler: isAuthed(async (ctx) => {
    const diaries = await ctx.db
      .query('diaries')
      .filter((q) => q.eq(q.field('user'), ctx.userId))
      .collect()
    return diaries
  }),
})

export const getDiary = query({
  args: { id: v.id('diaries') },
  handler: isAuthed(async (ctx, args) => {
    const diary = await ctx.db.get(args.id)
    if (diary?.user !== ctx.userId) {
      throw new Error('Unauthenticated call to query')
    }
    return diary
  }),
})

export const createDiary = mutation({
  args: {},
  handler: isAuthed(async (ctx) => {
    const diaryId = await ctx.db.insert('diaries', {
      content: '',
      mood: 'neutral',
      user: ctx.userId,
    })

    return diaryId
  }),
})

export const updateDiary = mutation({
  args: {
    id: v.id('diaries'),
    content: v.string(),
    updatedTime: v.optional(v.number()),
    mood: v.optional(
      v.union(
        v.literal('sad'),
        v.literal('happy'),
        v.literal('neutral'),
        v.literal('unknown'),
      ),
    ),
  },
  handler: isAuthed(async (ctx, args) => {
    await ctx.db.patch(args.id, {
      mood: args.mood,
      content: args.content,
      updatedTime: new Date().getTime(),
    })

    return args.id
  }),
})

export const deleteDiary = mutation({
  args: {
    id: v.id('diaries'),
  },
  handler: isAuthed(async (ctx, args) => {
    await ctx.db.delete(args.id)

    return args.id
  }),
})
