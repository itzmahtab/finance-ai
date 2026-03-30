import { Request, Response } from 'express'
import { db } from '../db'
import { transactions } from '../db/schema'
import { eq, desc } from 'drizzle-orm'

export const getTransactions = async (req: any, res: Response) => {
  try {
    const list = await db.query.transactions.findMany({
      where: eq(transactions.userId, req.userId),
      with: {
        category: true,
      },
      orderBy: [desc(transactions.transactionDate)],
      limit: 50,
    })

    res.json(list)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const createTransaction = async (req: any, res: Response) => {
  try {
    const { amount, categoryId, type, description, transactionDate, isRecurring, recurrencePeriod } = req.body

    const [newTransaction] = await db.insert(transactions).values({
      userId: req.userId,
      amount: amount.toString(),
      categoryId,
      type,
      description,
      transactionDate,
      isRecurring: isRecurring || false,
      recurrencePeriod,
    }).returning()

    // Fetch the transaction with its category for the response
    const txWithCategory = await db.query.transactions.findFirst({
      where: eq(transactions.id, newTransaction.id),
      with: {
        category: true,
      },
    })

    // Trigger budget alerts asynchronously
    const { checkBudgetAlerts } = require('../services/notification.service')
    checkBudgetAlerts(req.userId)

    res.status(201).json(txWithCategory)
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const list = await db.query.categories.findMany()
    res.json(list)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
