import { Router } from 'express'
import { chatWithAI, getAIHistory, getMonthlyReport } from '../controllers/ai.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/chat', authenticate, chatWithAI)
router.get('/history', authenticate, getAIHistory)
router.get('/report', authenticate, getMonthlyReport)

export default router
