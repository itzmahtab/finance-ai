import { relations } from 'drizzle-orm'
import { users } from './users'
import { profiles } from './profiles'
import { categories } from './categories'
import { transactions } from './transactions'
import { budgets, budgetItems } from './budgets_goals'
import { investments, notifications, aiConversations } from './others'

export * from './users'
export * from './profiles'
export * from './categories'
export * from './transactions'
export * from './budgets_goals'
export * from './others'

// Define Relations
export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  transactions: many(transactions),
  budgets: many(budgets),
}))

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}))

export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
}))

export const categoryRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  budgetItems: many(budgetItems),
}))

export const budgetRelations = relations(budgets, ({ one, many }) => ({
  user: one(users, { fields: [budgets.userId], references: [users.id] }),
  items: many(budgetItems),
}))

export const budgetItemRelations = relations(budgetItems, ({ one }) => ({
  budget: one(budgets, { fields: [budgetItems.budgetId], references: [budgets.id] }),
  category: one(categories, { fields: [budgetItems.categoryId], references: [categories.id] }),
}))
