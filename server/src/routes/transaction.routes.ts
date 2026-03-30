import { Router } from 'express'
import { getTransactions, createTransaction, getCategories } from '../controllers/transaction.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Category route
router.get('/categories', authenticate, getCategories)

// Transaction routes
router.get('/', authenticate, getTransactions)
router.post('/', authenticate, createTransaction)

export default router
