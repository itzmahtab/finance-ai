import { Response } from 'express'
import { db } from '../db'
import { profiles } from '../db/schema'
import { eq } from 'drizzle-orm'

export const getProfile = async (req: any, res: Response) => {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, req.userId),
    })

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, profession, country, currency, monthlySalary, currentSavings, riskTolerance, financialGoals } = req.body

    const [updatedProfile] = await db.update(profiles)
      .set({
        fullName,
        profession,
        country,
        currency,
        monthlySalary: monthlySalary?.toString(),
        currentSavings: currentSavings?.toString(),
        riskTolerance,
        financialGoals,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, req.userId))
      .returning()

    res.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
