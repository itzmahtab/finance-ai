import { Router } from 'express'
import { getCurrentBudget, initBudget } from '../controllers/budget.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/current', authenticate, getCurrentBudget)
router.post('/init', authenticate, initBudget)

export default router
