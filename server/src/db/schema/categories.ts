import { pgTable, serial, text, pgEnum, boolean } from 'drizzle-orm/pg-core'

export const categoryTypeEnum = pgEnum('category_type', ['need', 'want', 'saving', 'investment'])

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  type: categoryTypeEnum('type').notNull(),
  icon: text('icon'),
  color: text('color'),
  isDefault: boolean('is_default').default(false).notNull(),
})

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
