import { Request, Response } from 'express'
import { db } from '../db'
import { goals } from '../db/schema'
import { eq, desc } from 'drizzle-orm'

export const getGoals = async (req: any, res: Response) => {
  try {
    const list = await db.query.goals.findMany({
      where: eq(goals.userId, req.userId),
      orderBy: [desc(goals.createdAt)],
    })

    res.json(list)
  } catch (error) {
    console.error('Error fetching goals:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const createGoal = async (req: any, res: Response) => {
  try {
    const { title, description, targetAmount, currentAmount, monthlyContribution, targetDate, priority } = req.body

    const [newGoal] = await db.insert(goals).values({
      userId: req.userId,
      title,
      description,
      targetAmount: targetAmount.toString(),
      currentAmount: currentAmount ? currentAmount.toString() : '0',
      monthlyContribution: monthlyContribution ? monthlyContribution.toString() : null,
      targetDate,
      priority: priority || 'medium',
    }).returning()

    res.status(201).json(newGoal)
  } catch (error) {
    console.error('Error creating goal:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateGoal = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const { currentAmount, status } = req.body

    const [updatedGoal] = await db.update(goals)
      .set({
        currentAmount: currentAmount ? currentAmount.toString() : undefined,
        status: status || undefined,
      })
      .where(eq(goals.id, id))
      .returning()

    res.json(updatedGoal)
  } catch (error) {
    console.error('Error updating goal:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteGoal = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    await db.delete(goals).where(eq(goals.id, id))
    res.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
