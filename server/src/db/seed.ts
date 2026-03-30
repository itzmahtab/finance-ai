import { db } from './index'
import { categories } from './schema/categories'

const defaultCategories = [
  // Needs
  { name: 'Housing', type: 'need' as const, icon: 'Home', color: 'text-accent' },
  { name: 'Utilities', type: 'need' as const, icon: 'Zap', color: 'text-chart-1' },
  { name: 'Food & Groceries', type: 'need' as const, icon: 'ShoppingCart', color: 'text-warning' },
  { name: 'Transportation', type: 'need' as const, icon: 'Car', color: 'text-pink' },
  { name: 'Health', type: 'need' as const, icon: 'Heart', color: 'text-destructive' },
  
  // Wants
  { name: 'Dining & Cafe', type: 'want' as const, icon: 'Utensils', color: 'text-warning' },
  { name: 'Shopping', type: 'want' as const, icon: 'ShoppingBag', color: 'text-purple' },
  { name: 'Entertainment', type: 'want' as const, icon: 'Play', color: 'text-chart-5' },
  { name: 'Travel', type: 'want' as const, icon: 'Plane', color: 'text-chart-4' },
  
  // Savings & Investments
  { name: 'Emergency Fund', type: 'saving' as const, icon: 'Shield', color: 'text-primary' },
  { name: 'Stocks', type: 'investment' as const, icon: 'LineChart', color: 'text-primary' },
  { name: 'Crypto', type: 'investment' as const, icon: 'Coins', color: 'text-orange-500' },
  { name: 'Fixed Deposit', type: 'investment' as const, icon: 'Lock', color: 'text-accent' },
  
  // Other
  { name: 'Other', type: 'want' as const, icon: 'MoreHorizontal', color: 'text-foreground-muted' },
]

async function seed() {
  console.log('Seeding categories...')
  try {
    for (const cat of defaultCategories) {
      await db.insert(categories).values({
        ...cat,
        isDefault: true,
      }).onConflictDoUpdate({
        target: categories.name,
        set: {
          type: cat.type,
          icon: cat.icon,
          color: cat.color,
          isDefault: true,
        }
      })
    }
    console.log('Successfully seeded categories!')
  } catch (error) {
    console.error('Error seeding categories:', error)
  } finally {
    process.exit(0)
  }
}

seed()
