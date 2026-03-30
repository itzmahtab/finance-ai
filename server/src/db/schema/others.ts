import { pgTable, uuid, text, decimal, pgEnum, date, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'
import { users } from './users'

export const investmentTypeEnum = pgEnum('investment_type', ['stocks', 'etf', 'mutual_fund', 'retirement', 'crypto', 'other'])

export const investments = pgTable('investments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: investmentTypeEnum('type').notNull(),
  investedAmount: decimal('invested_amount', { precision: 20, scale: 2 }).notNull(),
  currentValue: decimal('current_value', { precision: 20, scale: 2 }).notNull(),
  startDate: date('start_date').notNull(),
  platform: text('platform'),
  notes: text('notes'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const notificationTypeEnum = pgEnum('notification_type', ['budget_alert', 'goal_milestone', 'insight', 'reminder', 'system'])

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: notificationTypeEnum('type').default('system').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const aiContextTypeEnum = pgEnum('ai_context_type', ['general', 'budget', 'investment', 'goal', 'report'])

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').$type<{ role: 'user' | 'assistant'; content: string }[]>().default([]).notNull(),
  contextType: aiContextTypeEnum('context_type').default('general').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Investment = typeof investments.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type AIConversation = typeof aiConversations.$inferSelect
