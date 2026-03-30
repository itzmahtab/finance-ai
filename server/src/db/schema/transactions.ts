import { pgTable, uuid, integer, decimal, text, pgEnum, date, boolean, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { categories } from './categories'

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense'])
export const recurrencePeriodEnum = pgEnum('recurrence_period', ['monthly', 'weekly', 'yearly'])

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  amount: decimal('amount', { precision: 20, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  description: text('description'),
  transactionDate: date('transaction_date').notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  recurrencePeriod: recurrencePeriodEnum('recurrence_period'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
