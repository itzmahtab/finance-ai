import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import * as dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import transactionRoutes from './routes/transaction.routes'
import budgetRoutes from './routes/budget.routes'
import aiRoutes from './routes/ai.routes'
import investmentRoutes from './routes/investment.routes'
import notificationRoutes from './routes/notification.routes'

dotenv.config()

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/investments', investmentRoutes)
app.use('/api/notifications', notificationRoutes)

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'FinanceAI API is running' })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

export default app
