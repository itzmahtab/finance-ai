import { Router } from 'express'
import { getInvestments, addInvestment, updateInvestment, deleteInvestment } from '../controllers/investment.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getInvestments)
router.post('/', authenticate, addInvestment)
router.patch('/:id', authenticate, updateInvestment)
router.delete('/:id', authenticate, deleteInvestment)

export default router
