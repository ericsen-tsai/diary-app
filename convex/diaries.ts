/* eslint-disable no-underscore-dangle */
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getDiaries = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called getDairies without authentication present')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new Error('Unauthenticated call to query')
    }
    const diaries = await ctx.db
      .query('diaries')
      .filter((q) => q.eq(q.field('user'), user._id))
      .collect()
    return diaries
  },
})

export const getDiary = query({
  args: { id: v.id('diaries') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called getDiary without authentication present')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new Error('Unauthenticated call to query')
    }
    const diary = await ctx.db.get(args.id)
    if (diary?.user !== user._id) {
      throw new Error('Unauthenticated call to query')
    }
    return diary
  },
})

export const createDiary = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called createDiary without authentication present')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new Error('Unauthenticated call to mutation')
    }
    const diaryId = await ctx.db.insert('diaries', {
      content: '',
      mood: 'neutral',
      user: user._id,
    })

    return diaryId
  },
})

export const updateDiary = mutation({
  args: {
    id: v.id('diaries'),
    content: v.string(),
    mood: v.optional(
      v.union(
        v.literal('sad'),
        v.literal('happy'),
        v.literal('neutral'),
        v.literal('unknown'),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called updateDiary without authentication present')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new Error('Unauthenticated call to mutation')
    }
    await ctx.db.patch(args.id, {
      mood: args.mood,
      content: args.content,
      updatedTime: new Date().getTime(),
    })

    return args.id
  },
})

export const deleteDiary = mutation({
  args: {
    id: v.id('diaries'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called deleteDiary without authentication present')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (!user) {
      throw new Error('Unauthenticated call to mutation')
    }
    await ctx.db.delete(args.id)

    return args.id
  },
})
