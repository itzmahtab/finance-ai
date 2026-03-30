import { Response } from 'express'
import { db } from '../db'
import { budgets, budgetItems, categories, transactions } from '../db/schema'
import { eq, and, sql, sum } from 'drizzle-orm'

export const getCurrentBudget = async (req: any, res: Response) => {
  try {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const currentBudget = await db.query.budgets.findFirst({
      where: and(
        eq(budgets.userId, req.userId),
        eq(budgets.month, month),
        eq(budgets.year, year)
      ),
      with: {
        items: {
          with: {
            category: true,
          },
        },
      },
    })

    if (!currentBudget) return res.json(null)

    // Calculate actual spent amounts for each category this month
    const itemIds = currentBudget.items.map(i => i.categoryId)
    const spentResults = await db
      .select({
        categoryId: transactions.categoryId,
        total: sum(transactions.amount),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, req.userId),
          sql`EXTRACT(MONTH FROM ${transactions.transactionDate}) = ${month}`,
          sql`EXTRACT(YEAR FROM ${transactions.transactionDate}) = ${year}`
        )
      )
      .groupBy(transactions.categoryId)

    // Merge spent results into budget items
    const itemsWithSpent = currentBudget.items.map(item => {
      const spent = spentResults.find(s => s.categoryId === item.categoryId)
      return {
        ...item,
        spentAmount: spent?.total || '0',
      }
    })

    res.json({
      ...currentBudget,
      items: itemsWithSpent,
    })
  } catch (error) {
    console.error('Error fetching current budget:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const initBudget = async (req: any, res: Response) => {
  try {
    const { totalAmount, strategy } = req.body
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    // Create the budget header
    const [newBudget] = await db.insert(budgets).values({
      userId: req.userId,
      name: `Budget ${month}/${year}`,
      totalAmount: totalAmount.toString(),
      month,
      year,
      strategy: strategy || '50_30_20',
    }).returning()

    // If strategy is 50_30_20, auto-allocate based on category types
    if (strategy === '50_30_20') {
      const allCategories = await db.query.categories.findMany()
      
      const itemsToInsert = allCategories.map(cat => {
        let percentage = 0
        if (cat.type === 'need') percentage = 50 / allCategories.filter(c => c.type === 'need').length
        else if (cat.type === 'want') percentage = 30 / allCategories.filter(c => c.type === 'want').length
        else if (cat.type === 'saving' || cat.type === 'investment') percentage = 20 / allCategories.filter(c => c.type === 'saving' || c.type === 'investment').length
        
        const allocated = (totalAmount * (percentage / 100))
        
        return {
          budgetId: newBudget.id,
          categoryId: cat.id,
          allocatedAmount: allocated.toFixed(2),
          percentage: percentage.toFixed(2),
        }
      })

      await db.insert(budgetItems).values(itemsToInsert)
    }

    const fullBudget = await db.query.budgets.findFirst({
      where: eq(budgets.id, newBudget.id),
      with: {
        items: {
          with: {
            category: true,
          },
        },
      },
    })

    res.status(201).json(fullBudget)
  } catch (error) {
    console.error('Error initializing budget:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
