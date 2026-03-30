import { Response } from 'express'
import { db } from '../db'
import { investments } from '../db/schema'
import { eq, desc } from 'drizzle-orm'

export const getInvestments = async (req: any, res: Response) => {
  try {
    const userInvestments = await db.query.investments.findMany({
      where: eq(investments.userId, req.userId),
      orderBy: [desc(investments.updatedAt)],
    })
    res.json(userInvestments)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch investments.' })
  }
}

export const addInvestment = async (req: any, res: Response) => {
  try {
    const { name, type, investedAmount, currentValue, startDate, platform, notes } = req.body

    const [newInvestment] = await db.insert(investments).values({
      userId: req.userId,
      name,
      type,
      investedAmount: investedAmount.toString(),
      currentValue: currentValue.toString(),
      startDate: new Date(startDate).toISOString().split('T')[0],
      platform,
      notes,
    }).returning()

    res.status(201).json(newInvestment)
  } catch (error) {
    console.error('Add Investment Error:', error)
    res.status(500).json({ message: 'Failed to add investment.' })
  }
}

export const updateInvestment = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate).toISOString().split('T')[0]
    }
    
    if (updateData.investedAmount) updateData.investedAmount = updateData.investedAmount.toString()
    if (updateData.currentValue) updateData.currentValue = updateData.currentValue.toString()

    const [updated] = await db.update(investments)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(investments.id, id))
      .returning()

    if (!updated) {
      return res.status(404).json({ message: 'Investment not found.' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update investment.' })
  }
}

export const deleteInvestment = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const [deleted] = await db.delete(investments)
      .where(eq(investments.id, id))
      .returning()

    if (!deleted) {
      return res.status(404).json({ message: 'Investment not found.' })
    }

    res.json({ message: 'Investment deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete investment.' })
  }
}
