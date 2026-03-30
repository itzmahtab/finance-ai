import { Response } from 'express'
import { db } from '../db'
import { notifications } from '../db/schema'
import { eq, desc, and } from 'drizzle-orm'

export const getNotifications = async (req: any, res: Response) => {
  try {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, req.userId),
      orderBy: [desc(notifications.createdAt)],
      limit: 20,
    })
    res.json(userNotifications)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications.' })
  }
}

export const markAsRead = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const [updated] = await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, req.userId)))
      .returning()

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found.' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read.' })
  }
}

export const markAllAsRead = async (req: any, res: Response) => {
  try {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, req.userId))

    res.json({ message: 'All notifications marked as read.' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear notifications.' })
  }
}
