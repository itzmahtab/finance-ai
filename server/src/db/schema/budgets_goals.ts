import { pgTable, uuid, text, decimal, integer, pgEnum, timestamp, date } from 'drizzle-orm/pg-core'
import { users } from './users'
import { categories } from './categories'

export const budgetStrategyEnum = pgEnum('budget_strategy', ['50_30_20', 'custom'])

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  totalAmount: decimal('total_amount', { precision: 20, scale: 2 }).notNull(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  strategy: budgetStrategyEnum('strategy').default('50_30_20').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const budgetItems = pgTable('budget_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  budgetId: uuid('budget_id').notNull().references(() => budgets.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  allocatedAmount: decimal('allocated_amount', { precision: 20, scale: 2 }).notNull(),
  spentAmount: decimal('spent_amount', { precision: 20, scale: 2 }).default('0').notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
})

export const goalPriorityEnum = pgEnum('goal_priority', ['high', 'medium', 'low'])
export const goalStatusEnum = pgEnum('goal_status', ['active', 'completed', 'paused'])

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  targetAmount: decimal('target_amount', { precision: 20, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 20, scale: 2 }).default('0').notNull(),
  monthlyContribution: decimal('monthly_contribution', { precision: 20, scale: 2 }),
  targetDate: date('target_date'),
  priority: goalPriorityEnum('priority').default('medium').notNull(),
  status: goalStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Budget = typeof budgets.$inferSelect
export type NewBudget = typeof budgets.$inferInsert
export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
