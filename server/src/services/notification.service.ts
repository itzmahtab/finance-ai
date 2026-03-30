import { db } from '../db'
import { budgets, budgetItems, transactions, notifications } from '../db/schema'
import { eq, and, sql, sum } from 'drizzle-orm'

export const checkBudgetAlerts = async (userId: string) => {
  try {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    // 1. Fetch current budget
    const currentBudget = await db.query.budgets.findFirst({
      where: and(
        eq(budgets.userId, userId),
        eq(budgets.month, month),
        eq(budgets.year, year)
      ),
      with: {
        items: {
          with: {
            category: true,
          }
        },
      },
    })

    if (!currentBudget) return

    // 2. For each budget item, check total spent
    for (const item of currentBudget.items) {
      const [spentResult] = await db
        .select({ total: sum(transactions.amount) })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.categoryId, item.categoryId),
            sql`EXTRACT(MONTH FROM ${transactions.transactionDate}) = ${month}`,
            sql`EXTRACT(YEAR FROM ${transactions.transactionDate}) = ${year}`
          )
        )

      const spent = parseFloat(spentResult?.total || '0')
      const allocated = parseFloat(item.allocatedAmount)

      // Alert if spent > 90%
      if (spent >= allocated * 0.9 && allocated > 0) {
        const title = `Budget Alert: ${item.category?.name}`
        const message = `You have spent ${spent} ৳ out of your ${allocated} ৳ budget for ${item.category?.name}. (${((spent/allocated)*100).toFixed(0)}%)`

        // Check if a similar notification was already sent today to avoid spam
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const existing = await db.query.notifications.findFirst({
          where: and(
            eq(notifications.userId, userId),
            eq(notifications.title, title),
            sql`${notifications.createdAt} >= ${today.toISOString()}`
          )
        })

        if (!existing) {
          await db.insert(notifications).values({
            userId,
            title,
            message,
            type: 'budget_alert',
            metadata: {
              categoryId: item.categoryId,
              spent,
              allocated,
            }
          })
        }
      }
    }
  } catch (error) {
    console.error('Check Budget Alerts Error:', error)
  }
}
