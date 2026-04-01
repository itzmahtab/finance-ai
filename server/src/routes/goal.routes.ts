import { Router } from 'express'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goal.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getGoals)
router.post('/', authenticate, createGoal)
router.patch('/:id', authenticate, updateGoal)
router.delete('/:id', authenticate, deleteGoal)

export default router
