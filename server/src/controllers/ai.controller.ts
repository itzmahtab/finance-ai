import { Response } from 'express'
import { db } from '../db'
import { budgets, transactions, aiConversations, profiles } from '../db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { getAICompletion, buildSystemPrompt, AIMessage, buildReportPrompt, generateMonthlyReport } from '../services/ai.service'

export const chatWithAI = async (req: any, res: Response) => {
  try {
    const { message } = req.body
    
    // 1. Fetch User Financial Context
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, req.userId),
    })

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
        items: true,
      },
    })

    const recentTx = await db.query.transactions.findMany({
      where: eq(transactions.userId, req.userId),
      with: {
        category: true,
      },
      orderBy: [desc(transactions.transactionDate)],
      limit: 10,
    })

    // 2. Calculate Context Stats
    const totalSpent = (recentTx || []).reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toString()
    
    const context = {
      userName: profile?.fullName || 'User',
      profession: profile?.profession || 'Not specified',
      currency: profile?.currency || 'BDT',
      totalBudget: currentBudget?.totalAmount || '0',
      spentAmount: totalSpent,
      recentTransactions: recentTx || [],
    }

    // 3. Build the prompt chain
    const systemPrompt = buildSystemPrompt(context)
    
    // For now, we'll just send the current message + system prompt
    // In a fuller version, we'd fetch conversation history from the db
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]

    // 4. Call AI Service
    const aiResponse = await getAICompletion(messages)

    // 5. Save to Conversation History (Optional for MVP, but good for persistence)
    await db.insert(aiConversations).values({
      userId: req.userId,
      messages: [
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse },
      ],
      contextType: 'general',
    }).onConflictDoNothing()

    res.json({ response: aiResponse })
  } catch (error) {
    console.error('AI Controller Error:', error)
    res.status(500).json({ message: 'AI Advisor is currently offline. Please try again later.' })
  }
}

export const getAIHistory = async (req: any, res: Response) => {
  try {
    const history = await db.query.aiConversations.findMany({
      where: eq(aiConversations.userId, req.userId),
      orderBy: [desc(aiConversations.createdAt)],
      limit: 20,
    })
    
    res.json(history)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history.' })
  }
}

export const getMonthlyReport = async (req: any, res: Response) => {
  try {
    // 1. Fetch Context
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, req.userId),
    })

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
          }
        },
      },
    })

    if (!currentBudget) {
      return res.status(404).json({ message: 'No budget found for the current month. Please set a budget first!' })
    }

    // Calculate total spent across all categories
    const totalSpent = (currentBudget.items || []).reduce((sum, item) => sum + parseFloat(item.spentAmount), 0)

    const context = {
      userName: profile?.fullName || 'User',
      profession: profile?.profession || 'Not specified',
      currency: profile?.currency || 'BDT',
      totalBudget: parseFloat(currentBudget.totalAmount),
      totalSpent,
      categoryTotals: currentBudget.items || [],
    }

    // 2. Generate Report
    const prompt = buildReportPrompt(context)
    const report = await generateMonthlyReport(prompt)

    // 3. Save to AI history as a special report entry
    // Using raw SQL to handle the enum cast explicitly as a safeguard in Neon
    await db.execute(sql`
      INSERT INTO "ai_conversations" ("user_id", "messages", "context_type")
      VALUES (${req.userId}::uuid, ${JSON.stringify([{ role: 'assistant', content: report }])}::jsonb, 'report'::ai_context_type)
    `)

    res.json({ report })
  } catch (error) {
    console.error('AI Report Error:', error)
    res.status(500).json({ message: 'Failed to generate financial report. Check your API key.' })
  }
}
