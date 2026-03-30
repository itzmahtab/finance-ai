import { pgTable, pgEnum, text, decimal, uuid, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { users } from './users'

export const riskToleranceEnum = pgEnum('risk_tolerance', ['low', 'medium', 'high'])

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name'),
  profession: text('profession'),
  country: text('country').default('Bangladesh').notNull(),
  currency: text('currency').default('BDT').notNull(),
  monthlySalary: decimal('monthly_salary', { precision: 20, scale: 2 }).default('0'),
  currentSavings: decimal('current_savings', { precision: 20, scale: 2 }).default('0'),
  riskTolerance: riskToleranceEnum('risk_tolerance').default('medium').notNull(),
  financialGoals: jsonb('financial_goals').$type<string[]>().default([]).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
