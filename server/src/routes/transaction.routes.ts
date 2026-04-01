import { Router } from 'express'
import { getTransactions, createTransaction, getCategories, deleteTransaction, bulkCreateTransactions } from '../controllers/transaction.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Category route
router.get('/categories', authenticate, getCategories)

// Transaction routes
router.get('/', authenticate, getTransactions)
router.post('/', authenticate, createTransaction)
router.post('/bulk', authenticate, bulkCreateTransactions)
router.delete('/:id', authenticate, deleteTransaction)

export default router
