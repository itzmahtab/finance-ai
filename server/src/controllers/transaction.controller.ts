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

export const deleteTransaction = async (req: any, res: Response) => {
  try {
    const { id } = req.params

    await db.delete(transactions)
      .where(eq(transactions.id, id))

    const { checkBudgetAlerts } = require('../services/notification.service')
    checkBudgetAlerts(req.userId)

    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const bulkCreateTransactions = async (req: any, res: Response) => {
  try {
    const { transactions: txList } = req.body

    const formattedTransactions = txList.map((tx: any) => ({
      userId: req.userId,
      amount: tx.amount.toString(),
      categoryId: parseInt(tx.categoryId),
      type: tx.type,
      description: tx.description,
      transactionDate: tx.transactionDate,
      isRecurring: false,
    }))

    const newTransactions = await db.insert(transactions)
      .values(formattedTransactions)
      .returning()

    const { checkBudgetAlerts } = require('../services/notification.service')
    checkBudgetAlerts(req.userId)

    res.status(201).json(newTransactions)
  } catch (error) {
    console.error('Error bulk creating transactions:', error)
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

