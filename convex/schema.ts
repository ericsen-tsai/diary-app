import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index('by_token', ['tokenIdentifier']),
  diaries: defineTable({
    user: v.id('users'),
    updatedTime: v.optional(v.number()),
    content: v.string(),
    mood: v.optional(v.union(v.literal('sad'), v.literal('happy'), v.literal('neutral'), v.literal('unknown'))),
  }),
})
